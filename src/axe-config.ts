/**
 * Axe-core configuration for WCAG accessibility testing
 * This will run in development mode only and log accessibility violations to the console
 */

import { useEffect } from 'react';

export function useAxe() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      import('@axe-core/react').then((axe) => {
        axe.default(React, ReactDOM, 1000, {
          rules: [
            // WCAG 2.1 AA rules
            { id: 'color-contrast', enabled: true }, // 1.4.3 Contrast
            { id: 'button-name', enabled: true }, // 4.1.2 Name, Role, Value
            { id: 'image-alt', enabled: true }, // 1.1.1 Non-text Content
            { id: 'label', enabled: true }, // 1.3.1, 4.1.2 Info and Relationships
            { id: 'link-name', enabled: true }, // 2.4.4, 4.1.2 Link Purpose
            { id: 'aria-required-attr', enabled: true }, // 4.1.2
            { id: 'aria-valid-attr', enabled: true }, // 4.1.2
            { id: 'landmark-one-main', enabled: true }, // 1.3.1
            { id: 'page-has-heading-one', enabled: true }, // 1.3.1
            { id: 'region', enabled: true }, // 1.3.1
          ],
        });
      });
    }
  }, []);
}

// Import React and ReactDOM for axe
import React from 'react';
import ReactDOM from 'react-dom/client';
