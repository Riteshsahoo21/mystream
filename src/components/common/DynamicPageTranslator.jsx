import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { isTranslationConfigured, translateTexts } from '../../services/translationService';

const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'CODE', 'PRE', 'TEXTAREA']);
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'];
const textNodeState = new WeakMap();
const attributeState = new WeakMap();

function shouldTranslate(value) {
  const trimmed = value?.trim();
  return Boolean(
    trimmed
    && trimmed.length > 1
    && trimmed.length <= 1000
    && /\p{L}/u.test(trimmed)
    && !/^(https?:\/\/|www\.|tt\d+$)/i.test(trimmed)
  );
}

function isIgnored(element) {
  return !element
    || IGNORED_TAGS.has(element.tagName)
    || Boolean(element.closest?.('[data-no-translate="true"]'));
}

function preserveSpacing(original, translated) {
  const leading = original.match(/^\s*/)?.[0] || '';
  const trailing = original.match(/\s*$/)?.[0] || '';
  return `${leading}${translated}${trailing}`;
}

export function DynamicPageTranslator() {
  const language = useAppStore((state) => state.language);
  const generationRef = useRef(0);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return undefined;

    const generation = generationRef.current + 1;
    generationRef.current = generation;
    let queuedTimer;

    const translateRoot = async (scanRoot = root) => {
      const textJobs = [];
      const attributeJobs = [];
      const textWalker = document.createTreeWalker(scanRoot, NodeFilter.SHOW_TEXT);
      let node = textWalker.nextNode();

      while (node) {
        const parent = node.parentElement;
        if (!isIgnored(parent)) {
          const current = node.nodeValue || '';
          let state = textNodeState.get(node);
          if (!state) {
            state = { original: current, lastApplied: null };
            textNodeState.set(node, state);
          } else if (current !== state.lastApplied && current !== state.original) {
            state.original = current;
            state.lastApplied = null;
          }

          if (language === 'en') {
            if (current !== state.original) node.nodeValue = state.original;
            state.lastApplied = state.original;
          } else if (
            isTranslationConfigured
            && shouldTranslate(state.original)
            && (current !== state.lastApplied || state.lastLanguage !== language)
          ) {
            textJobs.push({ node, state, value: state.original.trim() });
          }
        }
        node = textWalker.nextNode();
      }

      const elements = scanRoot.nodeType === Node.ELEMENT_NODE
        ? [scanRoot, ...scanRoot.querySelectorAll('*')]
        : [...root.querySelectorAll('*')];
      elements.forEach((element) => {
        if (isIgnored(element)) return;
        TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
          if (!element.hasAttribute(attribute)) return;
          const current = element.getAttribute(attribute) || '';
          let states = attributeState.get(element);
          if (!states) {
            states = new Map();
            attributeState.set(element, states);
          }
          let state = states.get(attribute);
          if (!state) {
            state = { original: current, lastApplied: null };
            states.set(attribute, state);
          } else if (current !== state.lastApplied && current !== state.original) {
            state.original = current;
            state.lastApplied = null;
          }

          if (language === 'en') {
            if (current !== state.original) element.setAttribute(attribute, state.original);
            state.lastApplied = state.original;
          } else if (
            isTranslationConfigured
            && shouldTranslate(state.original)
            && (current !== state.lastApplied || state.lastLanguage !== language)
          ) {
            attributeJobs.push({ element, attribute, state, value: state.original.trim() });
          }
        });
      });

      const jobs = [...textJobs, ...attributeJobs];
      if (!jobs.length || language === 'en' || !isTranslationConfigured) return;
      const uniqueValues = [...new Set(jobs.map((job) => job.value))];
      const translatedValues = await translateTexts(uniqueValues, language);
      if (generationRef.current !== generation) return;
      const translations = new Map(uniqueValues.map((value, index) => [value, translatedValues[index]]));

      jobs.forEach((job) => {
        const translated = translations.get(job.value);
        if (!translated) return;
        if (job.node) {
          if (!job.node.isConnected) return;
          if (job.node.nodeValue !== job.state.original && job.node.nodeValue !== job.state.lastApplied) return;
          const nextValue = preserveSpacing(job.state.original, translated);
          job.node.nodeValue = nextValue;
          job.state.lastApplied = nextValue;
          job.state.lastLanguage = language;
        } else if (job.element.isConnected) {
          const current = job.element.getAttribute(job.attribute);
          if (current !== job.state.original && current !== job.state.lastApplied) return;
          job.element.setAttribute(job.attribute, translated);
          job.state.lastApplied = translated;
          job.state.lastLanguage = language;
        }
      });
    };

    const queueTranslation = (scanRoot = root) => {
      clearTimeout(queuedTimer);
      queuedTimer = setTimeout(() => translateRoot(scanRoot), 80);
    };

    translateRoot();
    const observer = new MutationObserver((mutations) => {
      const changedRoot = mutations.find((mutation) => mutation.addedNodes.length)?.target || root;
      queueTranslation(changedRoot.nodeType === Node.ELEMENT_NODE ? changedRoot : changedRoot.parentElement || root);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: TRANSLATABLE_ATTRIBUTES });

    return () => {
      generationRef.current += 1;
      clearTimeout(queuedTimer);
      observer.disconnect();
    };
  }, [language]);

  return null;
}
