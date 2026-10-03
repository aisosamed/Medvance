const blogDropdown = document.querySelector(".blog-dropdown");
const blogDropdownToggle = document.querySelector(".blog-dropdown-toggle");

if (blogDropdown && blogDropdownToggle) {
    blogDropdownToggle.addEventListener("click", () => {
        const isOpen = blogDropdown.classList.toggle("open");

        blogDropdownToggle.setAttribute("aria-expanded", isOpen);
    });

    document.addEventListener("click", (event) => {
        if (!blogDropdown.contains(event.target)) {
            blogDropdown.classList.remove("open");
            blogDropdownToggle.setAttribute("aria-expanded", "false");
        }
    });
}


const mobileBlogDropdown = document.querySelector(".mobile-blog-dropdown");
const mobileBlogToggle = document.querySelector(
    ".mobile-blog-dropdown-toggle"
);

if (mobileBlogDropdown && mobileBlogToggle) {
    mobileBlogToggle.addEventListener("click", () => {
        const isOpen = mobileBlogDropdown.classList.toggle("open");

        mobileBlogToggle.setAttribute("aria-expanded", isOpen);
    });
}