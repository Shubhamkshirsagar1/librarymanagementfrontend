const member = {
    showDashboard: function () {
      document.getElementById("app-content").innerHTML = `
        <h2>Member Dashboard</h2>
        <div class="d-grid gap-2">
          <button class="btn btn-primary" id="view-books">View Available Books</button>
          <button class="btn btn-primary" id="view-history">View Borrow History</button>
          <button class="btn btn-danger" id="delete-account">Delete Account</button>
        </div>
        <div id="content" class="mt-4"></div>
      `;
  
      document
        .getElementById("view-books")
        .addEventListener("click", member.viewBooks);
      document
        .getElementById("view-history")
        .addEventListener("click", member.viewBorrowHistory);
      document
        .getElementById("delete-account")
        .addEventListener("click", member.deleteAccount);
    },
  
    viewBooks: async function () {
      document.getElementById("content").innerHTML =
        '<h3>Available Books</h3><div id="books-list"></div>';
      try {
        const books = await api.request("/member/books", "GET", null, true);
        let html =
          '<table class="table"><thead><tr><th>Title</th><th>Author</th><th>Actions</th></tr></thead><tbody>';
        books.forEach((book) => {
          html += `
            <tr>
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>
                <button class="btn btn-success btn-sm borrow-book" data-id="${book.id}">Borrow</button>
              </td>
            </tr>`;
        });
        html += "</tbody></table>";
        document.getElementById("books-list").innerHTML = html;
  
        const borrowButtons = document.querySelectorAll(".borrow-book");
        borrowButtons.forEach((btn) =>
          btn.addEventListener("click", member.borrowBook)
        );
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    borrowBook: async function () {
      const bookId = this.getAttribute("data-id");
      try {
        await api.request(`/member/borrow/${bookId}`, "POST", null, true);
        alert("Book borrowed successfully!");
        member.viewBooks(); // Refresh the list after borrowing
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    viewBorrowHistory: async function () {
      document.getElementById("content").innerHTML =
        '<h3>Your Borrow History</h3><div id="history-list"></div>';
      try {
        const history = await api.request("/member/history", "GET", null, true);
        let html =
          '<table class="table"><thead><tr><th>Title</th><th>Author</th><th>Borrowed At</th><th>Returned At</th><th>Actions</th></tr></thead><tbody>';
        history.forEach((entry) => {
          html += `
            <tr>
              <td>${entry.book.title}</td>
              <td>${entry.book.author}</td>
              <td>${new Date(entry.borrowed_at).toLocaleString()}</td>
              <td>${
                entry.returned_at
                  ? new Date(entry.returned_at).toLocaleString()
                  : "Not Returned"
              }</td>
              <td>${
                entry.returned_at
                  ? ""
                  : `<button class="btn btn-warning btn-sm return-book" data-id="${entry.book.id}">Return</button>`
              }</td>
            </tr>`;
        });
        html += "</tbody></table>";
        document.getElementById("history-list").innerHTML = html;
  
        const returnButtons = document.querySelectorAll(".return-book");
        returnButtons.forEach((btn) =>
          btn.addEventListener("click", member.returnBook)
        );
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    returnBook: async function () {
      const bookId = event.target.getAttribute("data-id");
      try {
        await api.request(`/member/return/${bookId}`, "POST", null, true);
        alert("Book returned successfully!");
        member.viewBorrowHistory();
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    deleteAccount: async function () {
      if (confirm("Are you sure you want to delete your account?")) {
        try {
          await api.request("/member/account", "DELETE", null, true);
          alert("Account deleted successfully!");
          auth.logout();
        } catch (error) {
          alert("Error: " + error.message);
        }
      }
    },
  };
  