// mindmap.js
document.addEventListener('DOMContentLoaded', function() {
    fetch('skills.json')
      .then(response => response.json())
      .then(data => {
        // Define layout constants
        const catDistance = 200; // Distance from center to category nodes
        const subDistance = 100;  // Distance between category and subskills or between subskills
        const verticalSpacing = 80; // Vertical spacing between nodes
        const totalCategories = data.categories.length;
        const leftCategories = Math.ceil(totalCategories / 2); // Categories on the left
        const rightCategories = Math.floor(totalCategories / 2); // Categories on the right
  
        // Initialize nodes and edges
        const nodes = [{
          id: 0,
          label: data.name,
          shape: 'box',
          x: 0,
          y: 0,
          font: { size: 24, face: 'Montserrat', color: 'white' },
          color: { 
            background: '#3498db', 
            border: '#2c3e50',
            hover: { background: '#2c3e50', border: '#3498db' }
          },
          borderWidth: 2,
          margin: 10
        }];
        const edges = [];
        let nodeId = 1;
  
        // Position categories and subskills
        data.categories.forEach((category, i) => {
          let xPos, direction;
          let verticalOffset;
  
          // Determine if this category goes left or right
          if (i < leftCategories) {
            // Left side
            direction = -1;
            verticalOffset = (i - (leftCategories - 1) / 2) * verticalSpacing;
          } else {
            // Right side
            direction = 1;
            verticalOffset = ((i - leftCategories) - (rightCategories - 1) / 2) * verticalSpacing;
          }
          xPos = direction * catDistance;
  
          // Category node
          nodes.push({
            id: nodeId,
            label: category.name,
            shape: 'ellipse',
            x: xPos,
            y: verticalOffset,
            font: { size: 18, face: 'Open Sans', color: '#2c3e50' },
            color: { 
              background: '#ecf0f1', 
              border: '#3498db',
              hover: { background: '#dfe9f3', border: '#2c3e50' }
            },
            borderWidth: 1,
            margin: 8
          });
          const categoryId = nodeId;
          nodeId++;
  
          // Subskill nodes (initially hidden)
          category.subskills.forEach((subskill, k) => {
            const subX = xPos + direction * (subDistance * (k + 1));
            const subY = verticalOffset;
            nodes.push({
              id: nodeId,
              label: subskill.name,
              shape: 'diamond',
              x: subX,
              y: subY,
              hidden: true,
              font: { size: 14, face: 'Open Sans', color: '#333' },
              color: { 
                background: '#f9f9f9', 
                border: '#3498db',
                hover: { background: '#e8ecef', border: '#2c3e50' }
              },
              borderWidth: 1,
              margin: 6
            });
            edges.push({ from: categoryId, to: nodeId });
            nodeId++;
          });
        });
  
        // Initialize Vis.js network
        const container = document.getElementById('mindmap');
        const networkData = { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) };
        const options = {
          physics: false, // Fixed positions
          interaction: { hover: true },
          edges: {
            color: '#3498db',
            width: 2
          }
        };
        const network = new vis.Network(container, networkData, options);
  
        // Toggle subskills on click
        network.on('click', function(params) {
          if (params.nodes.length > 0) {
            const clickedNodeId = params.nodes[0];
            const clickedNode = nodes.find(n => n.id === clickedNodeId);
            if (clickedNode && clickedNode.shape === 'ellipse') {
              const subskillNodes = edges.filter(e => e.from === clickedNodeId).map(e => e.to);
              subskillNodes.forEach(subId => {
                const subNode = nodes.find(n => n.id === subId);
                subNode.hidden = !subNode.hidden;
              });
              networkData.nodes.update(nodes);
            }
          }
        });
      });
  });