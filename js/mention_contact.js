console.log("CTCLINK : JS chargé pour autocomplétion contacts");

// URL AJAX correcte
var ajaxUrl = "/plugins/ctclink/front/ajax_contact_search.php";

// Supprimer un dropdown existant
function removeDropdown() {
    const old = document.getElementById("ctclink_dropdown");
    if (old) old.remove();
}

// Créer la liste déroulante
function showDropdown(items, editor, term) {
    removeDropdown();

    const rect = editor.getContentAreaContainer().getBoundingClientRect();
    const dropdown = document.createElement("div");
    dropdown.id = "ctclink_dropdown";
    dropdown.style.position = "absolute";
    dropdown.style.left = rect.left + "px";
    dropdown.style.top = (rect.top + 40) + "px";
    dropdown.style.zIndex = 99999;
    dropdown.style.background = "#fff";
    dropdown.style.border = "1px solid #ccc";
    dropdown.style.width = "300px";
    dropdown.style.maxHeight = "200px";
    dropdown.style.overflowY = "auto";
    dropdown.style.padding = "5px";
    dropdown.style.fontSize = "14px";
    dropdown.style.cursor = "pointer";

    items.forEach(item => {
        const div = document.createElement("div");
        const contactName = item.text.split(" (")[0]; // enlever l'email
        div.textContent = contactName;
        div.style.padding = "5px";

        div.addEventListener("click", () => {
            const contactId = item.id;
            const linkHTML = `<a href="/front/contact.form.php?id=${contactId}" target="_blank">#${contactName}</a>`;

            // Remplacer le terme #xxx par le lien
            const content = editor.getContent({ format: "html" });
            const pos = content.lastIndexOf("#");
            const before = content.substring(0, pos); // avant #
            const after = content.substring(pos + term.length + 1); // après le terme
            editor.setContent(before + linkHTML + after);

            removeDropdown();
        });

        dropdown.appendChild(div);
    });

    document.body.appendChild(dropdown);
    console.log("CTCLINK : dropdown affiché avec", items.length, "éléments");
}

// Requête AJAX
async function searchContacts(term) {
    console.log("CTCLINK : recherche AJAX pour :", term);
    try {
        const response = await fetch(ajaxUrl + "?term=" + encodeURIComponent(term));
        const json = await response.json();
        console.log("CTCLINK : réponse AJAX", json);
        return json;
    } catch (e) {
        console.error("CTCLINK : erreur AJAX", e);
        return [];
    }
}

// Gérer la saisie dans TinyMCE
function handleInput(ev, editor) {
    const content = editor.getContent({ format: "text" });
    const pos = content.lastIndexOf("#");

    if (pos === -1) {
        removeDropdown();
        return;
    }

    const term = content.substring(pos + 1).trim();
    console.log("CTCLINK : terme après # =", term);

    if (term.length >= 1) {
        searchContacts(term).then(results => {
            if (results.length > 0) {
                showDropdown(results, editor, term);
            } else {
                removeDropdown();
            }
        });
    }
}

// Attacher le listener sur tous les éditeurs TinyMCE
tinymce.on("AddEditor", function (e) {
    const editor = e.editor;
    console.log("CTCLINK : listener attaché à l’éditeur :", editor.id);

    editor.on("keyup", function (ev) {
        handleInput(ev, editor);
    });
});

console.log("CTCLINK : initialisation écouteur TinyMCE terminée");
