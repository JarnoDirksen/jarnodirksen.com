document.addEventListener('DOMContentLoaded', function() {
  fetch('workexperience.json')
    .then(response => response.json())
    .then(data => {
      const timelineList = document.getElementById('timeline-list');
      data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div class="timeline-content">
            <h4 class="date">${item.date}</h4>
            <div class="heading-with-logo">
              <h3>${item.heading}</h3>
              <img src="${item.logo}" alt="${item.heading} logo" class="company-logo-right">
            </div>
            <p>${item.description}</p>
          </div>
        `;
        timelineList.appendChild(li);
      });
    })
    .catch(error => console.error('Error loading JSON:', error));
});