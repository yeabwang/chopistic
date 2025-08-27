function initApp(): void {
  const contentDiv = document.getElementById("app-content");
  if (contentDiv) {
    contentDiv.innerHTML = `
      <div class="alert alert-success text-center">
        <h4>🎉 Setup Successful!</h4>
        <p>TypeScript + Bootstrap are loaded correctly.</p>
        <p><strong>Current time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", initApp);
console.log("Chopistics app initialized! 🚀");
