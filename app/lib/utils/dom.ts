// DOM element utilities
export function getElementById<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

export function getElementBySelector<T extends HTMLElement>(selector: string): T | null {
  return document.querySelector(selector) as T | null;
}

export function getElementsBySelector<T extends HTMLElement>(selector: string): T[] {
  return Array.from(document.querySelectorAll(selector)) as T[];
}

export function createElement<T extends HTMLElement>(tag: string, className?: string): T {
  const element = document.createElement(tag) as T;
  if (className) {
    element.className = className;
  }
  return element;
}

// Focus utilities
export function focusElement(element: HTMLElement | null): void {
  if (element) {
    element.focus();
  }
}

export function focusFirstInput(container?: HTMLElement): void {
  const target = container || document;
  const firstInput = target.querySelector('input, textarea, select, button[tabindex]:not([tabindex="-1"])') as HTMLElement;
  focusElement(firstInput);
}

export function focusLastInput(container?: HTMLElement): void {
  const target = container || document;
  const inputs = target.querySelectorAll('input, textarea, select, button[tabindex]:not([tabindex="-1"])');
  const lastInput = inputs[inputs.length - 1] as HTMLElement;
  focusElement(lastInput);
}

// Scroll utilities
export function scrollToElement(element: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
  element.scrollIntoView({ behavior, block: 'nearest' });
}

export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  window.scrollTo({ top: 0, behavior });
}

export function scrollToBottom(element: HTMLElement, behavior: ScrollBehavior = 'smooth'): void {
  element.scrollTo({ top: element.scrollHeight, behavior });
}

export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Event utilities
export function addEventListener<T extends Event>(
  element: EventTarget,
  event: string,
  handler: (event: T) => void,
  options?: AddEventListenerOptions
): () => void {
  element.addEventListener(event, handler as EventListener, options);
  return () => element.removeEventListener(event, handler as EventListener, options);
}

export function addGlobalEventListener<T extends Event>(
  event: string,
  handler: (event: T) => void,
  options?: AddEventListenerOptions
): () => void {
  return addEventListener(window, event, handler, options);
}

export function addDocumentEventListener<T extends Event>(
  event: string,
  handler: (event: T) => void,
  options?: AddEventListenerOptions
): () => void {
  return addEventListener(document, event, handler, options);
}

// Click outside utility
export function addClickOutsideListener(
  element: HTMLElement,
  callback: () => void
): () => void {
  const handleClickOutside = (event: Event) => {
    if (!element.contains(event.target as Node)) {
      callback();
    }
  };

  return addDocumentEventListener('mousedown', handleClickOutside);
}

// Keyboard utilities
export function addKeyboardListener(
  element: HTMLElement,
  key: string,
  callback: (event: KeyboardEvent) => void,
  options?: { ctrlKey?: boolean; shiftKey?: boolean; altKey?: boolean }
): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === key) {
      if (options?.ctrlKey && !event.ctrlKey) return;
      if (options?.shiftKey && !event.shiftKey) return;
      if (options?.altKey && !event.altKey) return;
      
      callback(event);
    }
  };

  return addEventListener(element, 'keydown', handleKeyDown);
}

export function addEscapeListener(callback: () => void): () => void {
  return addGlobalEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      callback();
    }
  });
}

// Clipboard utilities
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

export async function readFromClipboard(): Promise<string> {
  try {
    return await navigator.clipboard.readText();
  } catch (error) {
    throw new Error('Failed to read from clipboard');
  }
}

// Download utilities
export function downloadFile(data: string | Blob, filename: string, mimeType?: string): void {
  const blob = typeof data === 'string' ? new Blob([data], { type: mimeType || 'text/plain' }) : data;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// File utilities
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Viewport utilities
export function getViewportSize(): { width: number; height: number } {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight
  };
}

export function isMobile(): boolean {
  return window.innerWidth < 768;
}

export function isTablet(): boolean {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

export function isDesktop(): boolean {
  return window.innerWidth >= 1024;
}

// Storage utilities
export function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to set localStorage:', error);
  }
}

export function getLocalStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('Failed to get localStorage:', error);
    return defaultValue || null;
  }
}

export function removeLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove localStorage:', error);
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
}

// Session storage utilities
export function setSessionStorage(key: string, value: any): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to set sessionStorage:', error);
  }
}

export function getSessionStorage<T>(key: string, defaultValue?: T): T | null {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    console.error('Failed to get sessionStorage:', error);
    return defaultValue || null;
  }
}

export function removeSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove sessionStorage:', error);
  }
}

export function clearSessionStorage(): void {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error('Failed to clear sessionStorage:', error);
  }
} 