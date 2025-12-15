// Subscribe to data and style changes
dscc.subscribeToData(drawViz, {transform: dscc.objectTransform});

let isExpanded = false;

function drawViz(data) {
  // Clear existing content
  document.body.innerHTML = '';
  
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
    <span class="header-text">${headerText}</span>
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
