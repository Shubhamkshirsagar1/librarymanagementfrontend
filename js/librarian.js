const librarian = {
    showDashboard: function () {
      document.getElementById("app-content").innerHTML = `
        <h2>Librarian Dashboard</h2>
        <div class="d-grid gap-2">
          <button class="btn btn-primary" id="manage-books">Manage Books</button>
          <button class="btn btn-primary" id="manage-members">Manage Members</button>
        </div>
        <div id="content" class="mt-4"></div>
      `;
  
      document
        .getElementById("manage-books")
        .addEventListener("click", librarian.manageBooks);
      document
        .getElementById("manage-members")
        .addEventListener("click", librarian.manageMembers);
    },
  
    manageBooks: async function () {
      document.getElementById("content").innerHTML = `
        <h3>Manage Books</h3>
        <button class="btn btn-success mb-3" id="add-book">Add Book</button>
        <div id="books-list"></div>
      `;
  
      document
        .getElementById("add-book")
        .addEventListener("click", librarian.showAddBookForm);
      await librarian.listBooks();
    },
  
    listBooks: async function () {
      try {
        const books = await api.request("/librarian/books", "GET", null, true);
        let html =
          '<table class="table"><thead><tr><th>Title</th><th>Author</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
        books.forEach((book) => {
          html += `
            <tr>
              <td>${book.title}</td>
              <td>${book.author}</td>
              <td>${book.status}</td>
              <td>
                <button class="btn btn-info btn-sm edit-book" data-id="${book.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-book" data-id="${book.id}">Delete</button>
              </td>
            </tr>`;
        });
        html += "</tbody></table>";
        document.getElementById("books-list").innerHTML = html;
  
        const editButtons = document.querySelectorAll(".edit-book");
        const deleteButtons = document.querySelectorAll(".delete-book");
        editButtons.forEach((btn) =>
          btn.addEventListener("click", librarian.showEditBookForm)
        );
        deleteButtons.forEach((btn) =>
          btn.addEventListener("click", librarian.deleteBook)
        );
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    showAddBookForm: function () {
      document.getElementById("content").innerHTML = `
        <h3>Add Book</h3>
        <form id="add-book-form">
          <div class="mb-3">
            <label for="title" class="form-label">Title</label>
            <input type="text" class="form-control" id="title" required />
          </div>
          <div class="mb-3">
            <label for="author" class="form-label">Author</label>
            <input type="text" class="form-control" id="author" required />
          </div>
          <button type="submit" class="btn btn-primary">Add Book</button>
        </form>
      `;
      document
        .getElementById("add-book-form")
        .addEventListener("submit", librarian.addBook);
    },
  
    addBook: async function (event) {
      event.preventDefault();
      const data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
      };
  
      try {
        await api.request("/librarian/book", "POST", data, true);
        alert("Book added successfully!");
        librarian.manageBooks();
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    showEditBookForm: async function () {
      const bookId = this.getAttribute("data-id");
      try {
        const book = await api.request(
          `/librarian/book/${bookId}`,
          "GET",
          null,
          true
        );
        document.getElementById("content").innerHTML = `
          <h3>Edit Book</h3>
          <form id="edit-book-form">
            <input type="hidden" id="book-id" value="${book.id}" />
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input type="text" class="form-control" id="title" value="${book.title}" required />
            </div>
            <div class="mb-3">
              <label for="author" class="form-label">Author</label>
              <input type="text" class="form-control" id="author" value="${book.author}" required />
            </div>
            <div class="mb-3">
              <label for="isbn" class="form-label">ISBN</label>
              <input type="text" class="form-control" id="isbn" value="${book.isbn}" required />
            </div>
            <button type="submit" class="btn btn-primary">Update Book</button>
          </form>
        `;
        document
          .getElementById("edit-book-form")
          .addEventListener("submit", librarian.updateBook);
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    updateBook: async function (event) {
      event.preventDefault();
      const bookId = document.getElementById("book-id").value;
      const data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
      };
  
      try {
        await api.request(`/librarian/book/${bookId}`, "PUT", data, true);
        alert("Book updated successfully!");
        librarian.manageBooks();
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    deleteBook: async function () {
      const bookId = this.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this book?")) {
        try {
          await api.request(`/librarian/book/${bookId}`, "DELETE", null, true);
          alert("Book deleted successfully!");
          librarian.manageBooks();
        } catch (error) {
          alert("Error: " + error.message);
        }
      }
    },
  
    manageMembers: async function () {
      document.getElementById("content").innerHTML = `
        <h3>Manage Members</h3>
        <button class="btn btn-success mb-3" id="add-member">Add Member</button>
        <div id="members-list"></div>
      `;
  
      document
        .getElementById("add-member")
        .addEventListener("click", librarian.showAddMemberForm);
      await librarian.listMembers();
    },
  
    listMembers: async function () {
      try {
        const members = await api.request(
          "/librarian/members",
          "GET",
          null,
          true
        );
        let html =
          '<table class="table"><thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead><tbody>';
        members.forEach((member) => {
          html += `
            <tr>
              <td>${member.first_name} ${member.last_name}</td>
              <td>${member.email}</td>
              <td>${member.status}</td>
              <td>
                <button class="btn btn-info btn-sm edit-member" data-id="${member.id}">Edit</button>
                <button class="btn btn-danger btn-sm delete-member" data-id="${member.id}">Delete</button>
              </td>
            </tr>`;
        });
        html += "</tbody></table>";
        document.getElementById("members-list").innerHTML = html;
  
        const editButtons = document.querySelectorAll(".edit-member");
        const deleteButtons = document.querySelectorAll(".delete-member");
        editButtons.forEach((btn) =>
          btn.addEventListener("click", librarian.showEditMemberForm)
        );
        deleteButtons.forEach((btn) =>
          btn.addEventListener("click", librarian.deleteMember)
        );
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    showEditBookForm: async function () {
      const bookId = this.getAttribute("data-id");
      try {
        const book = await api.request(
          `/librarian/book/${bookId}`,
          "GET",
          null,
          true
        );
  
        if (!book || !book.title || !book.author) {
          throw new Error("Invalid book data received.");
        }
  
        document.getElementById("content").innerHTML = `
          <h3>Edit Book</h3>
          <form id="edit-book-form">
            <input type="hidden" id="book-id" value="${book.id}" />
            <div class="mb-3">
              <label for="title" class="form-label">Title</label>
              <input type="text" class="form-control" id="title" value="${book.title}" required />
            </div>
            <div class="mb-3">
              <label for="author" class="form-label">Author</label>
              <input type="text" class="form-control" id="author" value="${book.author}" required />
            </div>
            <button type="submit" class="btn btn-primary">Update Book</button>
          </form>
        `;
  
        document
          .getElementById("edit-book-form")
          .addEventListener("submit", librarian.updateBook);
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    showAddMemberForm: function () {
      document.getElementById("content").innerHTML = `
        <h3>Add Member</h3>
        <form id="add-member-form">
          <div class="mb-3">
            <label for="first_name" class="form-label">First Name</label>
            <input type="text" class="form-control" id="first_name" required />
          </div>
          <div class="mb-3">
            <label for="last_name" class="form-label">Last Name</label>
            <input type="text" class="form-control" id="last_name" required />
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="email" class="form-control" id="email" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control" id="password" required />
          </div>
          <button type="submit" class="btn btn-primary">Add Member</button>
        </form>
      `;
      document
        .getElementById("add-member-form")
        .addEventListener("submit", librarian.addMember);
    },
  
    addMember: async function (event) {
      event.preventDefault();
      const data = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      };
  
      try {
        await api.request("/librarian/member", "POST", data, true);
        alert("Member added successfully!");
        librarian.manageMembers();
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    showEditMemberForm: async function () {
      const memberId = this.getAttribute("data-id");
  
      try {
        // Fetch member details from the API
        const member = await api.request(
          `/librarian/member/${memberId}`,
          "GET",
          null,
          true
        );
  
        // Ensure valid member data is returned
        if (!member || !member.first_name) {
          throw new Error("Invalid member data received.");
        }
  
        // Populate the edit form with the member data
        document.getElementById("content").innerHTML = `
          <h3>Edit Member</h3>
          <form id="edit-member-form">
            <input type="hidden" id="member-id" value="${member.id}" />
            <div class="mb-3">
              <label for="first_name" class="form-label">First Name</label>
              <input type="text" class="form-control" id="first_name" value="${member.first_name}" required />
            </div>
            <div class="mb-3">
              <label for="last_name" class="form-label">Last Name</label>
              <input type="text" class="form-control" id="last_name" value="${member.last_name}" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input type="email" class="form-control" id="email" value="${member.email}" required />
            </div>
            <button type="submit" class="btn btn-primary">Update Member</button>
          </form>
        `;
  
        // Bind the form submission to the updateMember function
        document
          .getElementById("edit-member-form")
          .addEventListener("submit", librarian.updateMember);
      } catch (error) {
        alert("Error: " + error.message);
      }
    },
  
    updateMember: async function (event) {
      event.preventDefault();
  
      const memberId = document.getElementById("member-id").value;
      const data = {
        first_name: document.getElementById("first_name").value,
        last_name: document.getElementById("last_name").value,
        email: document.getElementById("email").value,
      };
  
      try {
        // Send the updated data to the API (PUT request)
        await api.request(`/librarian/member/${memberId}`, "PUT", data, true);
        alert("Member updated successfully!");
  
        // Refresh the list of members after the update
        librarian.manageMembers();
      } catch (error) {
        alert("Error updating member: " + error.message);
      }
    },
  
    deleteMember: async function () {
      const memberId = this.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this member?")) {
        try {
          await api.request(
            `/librarian/member/${memberId}`,
            "DELETE",
            null,
            true
          );
          alert("Member deleted successfully!");
          librarian.manageMembers();
        } catch (error) {
          alert("Error: " + error.message);
        }
      }
    },
  };
  