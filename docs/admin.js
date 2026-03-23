console.log("ADMIN JS LOADED");

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("/all");
        const data = await res.json();

        console.log("DATA:", data);

        const div = document.getElementById("data");

        if (!div) {
            console.error("❌ #data div not found");
            return;
        }

        div.innerHTML = "";

        if (data.length === 0) {
            div.innerHTML = "<p>No registrations found</p>";
            return;
        }

        data.forEach(r => {
            const card = document.createElement("div");
            card.className = "card";

            card.innerHTML = `
                <h3>${r.name}</h3>
                <p>${r.email}</p>
                <b>${r.event}</b>
                <button onclick="deleteUser(${r.id})">Delete</button>
            `;

            div.appendChild(card);
        });

    } catch (error) {
        console.error("❌ Error:", error);
    }
});

// 🔥 DELETE FUNCTION ADDED
async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete?")) return;

    try {
        await fetch(`/delete/${id}`, {
            method: "DELETE"
        });

        alert("Deleted!");
        location.reload();

    } catch (error) {
        console.error("Delete error:", error);
    }
}