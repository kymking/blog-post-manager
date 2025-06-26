const baseURL = "http://localhost:3000/posts";
const postList = document.getElementById("post-list");
const detailTitle = document.getElementById("detail-title");
const detailContent = document.getElementById("detail-content");
const detailAuthor = document.getElementById("detail-author");
const newPostForm = document.getElementById("new-post-form");
const editPostForm = document.getElementById("edit-post-form");
const editButton = document.getElementById("edit-button");
const deleteButton = document.getElementById("delete-button");
const cancelEdit = document.getElementById("cancel-edit");

let currentPost = null;

// Display all posts
function displayPosts() {
  fetch(baseURL)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json();
    })
    .then((posts) => {
      postList.innerHTML = "";
      posts.forEach((post) => {
        const div = document.createElement("div");
        div.textContent = post.title;
        div.addEventListener("click", () => handlePostClick(post));
        postList.appendChild(div);
      });

      if (posts.length > 0) handlePostClick(posts[0]); // Show first post by default
    })
    .catch((err) => {
      postList.innerHTML = "Error loading posts.";
      console.error(err);
    });
}

// Handle single post view
function handlePostClick(post) {
  currentPost = post;
  detailTitle.textContent = post.title;
  detailContent.textContent = post.content;
  detailAuthor.textContent = post.author;
  editPostForm.classList.add("hidden");
}

// Add a new post
function addNewPostListener() {
  newPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newPost = {
      title: newPostForm.title.value,
      content: newPostForm.content.value,
      author: newPostForm.author.value,
    };

    fetch(baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add post");
        newPostForm.reset();
        displayPosts();
      })
      .catch((err) => {
        alert("Error adding post.");
        console.error(err);
      });
  });
}

// Edit post
if (editButton && editPostForm) {
  editButton.addEventListener("click", () => {
    if (!currentPost) return;
    editPostForm.classList.remove("hidden");
    editPostForm["edit-title"].value = currentPost.title;
    editPostForm["edit-content"].value = currentPost.content;
  });
}

if (editPostForm) {
  editPostForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const updated = {
      title: editPostForm["edit-title"].value,
      content: editPostForm["edit-content"].value,
    };

    fetch(`${baseURL}/${currentPost.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update post");
        editPostForm.classList.add("hidden");
        displayPosts();
      })
      .catch((err) => {
        alert("Error updating post.");
        console.error(err);
      });
  });
}

// Cancel edit
if (cancelEdit && editPostForm) {
  cancelEdit.addEventListener("click", () => {
    editPostForm.classList.add("hidden");
  });
}

// Delete post
if (deleteButton) {
  deleteButton.addEventListener("click", () => {
    if (!currentPost) return;

    fetch(`${baseURL}/${currentPost.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete post");
        currentPost = null;
        detailTitle.textContent = "Select a post";
        detailContent.textContent = "";
        detailAuthor.textContent = "";
        displayPosts();
      })
      .catch((err) => {
        console.error(err);
        alert("Error deleting post.");
      });
  });
}

// Start the app
function main() {
  displayPosts();
  addNewPostListener();
}

document.addEventListener("DOMContentLoaded", main);