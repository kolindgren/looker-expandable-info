// DSCC Helper Library (minified version)
// This is the official Google Data Studio Community Component helper library
const dscc = (function() {
  'use strict';
  
  const subscriptions = {};
  const LOCAL = 'LOCAL';
  const DASHBOARD = 'DASHBOARD';
  
  function postMessage(messageType, message) {
    const messageObj = {
      type: messageType,
      message: message
    };
    window.parent.postMessage(messageObj, '*');
  }
  
  function objectTransform(message) {
    const tables = message.tables;
    const fields = message.fields;
    const style = message.style;
    const theme = message.theme;
    const interactions = message.interactions;
    
    return {
      tables: tables,
      fields: fields,
      style: style,
      theme: theme,
      interactions: interactions
    };
  }
  
  function subscribeToData(callback, options) {
    const transform = options && options.transform ? options.transform : function(x) { return x; };
    
    window.addEventListener('message', function(event) {
      if (event.data && event.data.type === 'vizData') {
        const transformedData = transform(event.data.message);
        callback(transformedData);
      }
    });
    
    // Signal that component is ready
    postMessage('vizReady', {});
  }
  
  return {
    subscribeToData: subscribeToData,
    objectTransform: objectTransform,
    LOCAL: LOCAL,
    DASHBOARD: DASHBOARD
  };
})();

// Component Code
let isExpanded = false;

// Subscribe to data and style changes
dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});

function drawViz(data) {
  // Clear existing content
  document.body.innerHTML = '';
  
  // Inject styles
  injectStyles();
  
  // Get style configuration
  const style = data.style;
  const headerText = style.headerText.value || style.headerText.defaultValue;
  const expandedText = style.expandedText.value || style.expandedText.defaultValue;
  
  // Create container
  const container = document.createElement('div');
  container.id = 'expandable-container';
  
  // Create header row
  const header = document.createElement('div');
  header.id = 'header-row';
  header.innerHTML = `
    <span class="header-text">${escapeHtml(headerText)}</span>
    <span class="toggle-icon">${isExpanded ? '▼' : '▶'}</span>
  `;
  
  // Apply header styles
  header.style.backgroundColor = style.headerBgColor.value.color || style.headerBgColor.defaultValue;
  header.style.color = style.headerTextColor.value.color || style.headerTextColor.defaultValue;
  header.style.borderColor = style.borderColor.value.color || style.borderColor.defaultValue;
  header.style.fontSize = style.fontSize.value || style.fontSize.defaultValue;
  
  // Create expanded content area
  const expandedContent = document.createElement('div');
  expandedContent.id = 'expanded-content';
  expandedContent.className = isExpanded ? 'expanded' : 'collapsed';
  
  // Check if there's data from a dimension
  let contentToShow = expandedText;
  if (data.tables.DEFAULT && data.tables.DEFAULT.length > 0) {
    const row = data.tables.DEFAULT[0];
    if (row.infoText && row.infoText.length > 0) {
      contentToShow = row.infoText[0];
    }
  }
  
  expandedContent.innerHTML = `<div class="content-text">${contentToShow}</div>`;
  
  // Apply expanded content styles
  expandedContent.style.backgroundColor = style.expandedBgColor.value.color || style.expandedBgColor.defaultValue;
  expandedContent.style.color = style.expandedTextColor.value.color || style.expandedTextColor.defaultValue;
  expandedContent.style.borderColor = style.borderColor.value.color || style.borderColor.defaultValue;
  expandedContent.style.fontSize = style.fontSize.value || style.fontSize.defaultValue;
  
  // Add click handler to toggle
  header.addEventListener('click', function() {
    isExpanded = !isExpanded;
    expandedContent.className = isExpanded ? 'expanded' : 'collapsed';
    const toggleIcon = header.querySelector('.toggle-icon');
    toggleIcon.textContent = isExpanded ? '▼' : '▶';
  });
  
  // Append elements
  container.appendChild(header);
  container.appendChild(expandedContent);
  document.body.appendChild(container);
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Function to inject CSS styles
function injectStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Roboto', Arial, sans-serif;
      overflow: visible;
    }

    #expandable-container {
      width: 100%;
      position: relative;
      z-index: 1000;
    }

    #header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      cursor: pointer;
      border: 1px solid;
      border-radius: 4px;
      transition: background-color 0.2s ease;
      user-select: none;
    }

    #header-row:hover {
      opacity: 0.9;
    }

    .header-text {
      font-weight: 500;
      flex-grow: 1;
    }

    .toggle-icon {
      font-size: 12px;
      margin-left: 8px;
      transition: transform 0.3s ease;
    }

    #expanded-content {
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease, opacity 0.3s ease;
      border: 1px solid;
      border-top: none;
      border-radius: 0 0 4px 4px;
      margin-top: -4px;
    }

    #expanded-content.collapsed {
      max-height: 0;
      padding: 0 16px;
      opacity: 0;
      border: none;
    }

    #expanded-content.expanded {
      max-height: 1000px;
      padding: 16px;
      opacity: 1;
    }

    .content-text {
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  `;
  document.head.appendChild(styleElement);
}
