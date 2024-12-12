document.getElementById('generate-btn').addEventListener('click', async () => {
    const messageElement = document.getElementById('message');
    
    try {
      const response = await fetch('/generate-random');
      const message = await response.text();
      messageElement.textContent = message;
    } catch (error) {
      messageElement.textContent = 'Error: Could not generate the file.';
    }
  });
  