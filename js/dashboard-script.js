/* --- COMPLETE AND FIXED ADMIN UPLOAD SCRIPT (dashboard-script.js) --- */

// Firebase configuration (Ensure this is correct for YOUR project)
const firebaseConfig = {
    apiKey: "AIzaSyCPN3VAXottCg3vDr0fMSu1niSVGNT3V9o",
    authDomain: "cbsnu-d8dbb.firebaseapp.com",
    projectId: "cbsnu-d8dbb",
    storageBucket: "cbsnu-d8dbb.firebasestorage.app",
    messagingSenderId: "1066269637289",
    appId: "1:1066269637289:web:cb1977ba240e05a0b587b8",
    measurementId: "G-TMBEL8E5ZQ"
};

// Initialize Firebase once
let db = null;
let storage = null;

if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
    storage = firebase.storage(); 
}

// Global DOM references
const uploadsCollection = db ? db.collection("teacher_announcements") : null;
const uploadForm = document.getElementById('upload-form');
const uploadStatus = document.getElementById('upload-status');
const pastPostsList = document.getElementById('past-posts-list');
const uploadBtn = document.getElementById('upload-btn');


// Function to display status messages (uses styles from dashboard-style.css)
function setStatus(message, type = 'info') {
    if (!uploadStatus) return;
    uploadStatus.textContent = message;
    uploadStatus.className = `status-message status-${type}`; 
    uploadStatus.style.display = 'block';
    setTimeout(() => { uploadStatus.style.display = 'none'; }, 5000);
}

// --- ADMIN UPLOAD HANDLER ---
async function handleUpload(event) {
    event.preventDefault();
    
    if (!db || !storage) {
         setStatus('Database or Storage not connected. Check console.', 'error');
         return;
    }

    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Posting...';

    const title = document.getElementById('upload-title').value;
    const type = document.getElementById('upload-type').value;
    const description = document.getElementById('upload-description').value;
    const fileInput = document.getElementById('upload-file');
    const file = fileInput.files[0];
    
    let fileURL = null;
    let fileName = null;

    try {
        // 1. Handle File Upload (if file exists)
        if (file) {
            setStatus(`Uploading file: ${file.name}...`, 'info');
            const storageRef = storage.ref(`announcements/${Date.now()}_${file.name}`);
            const uploadTask = storageRef.put(file);
            
            // Await completion of file upload
            await uploadTask;
            
            fileURL = await storageRef.getDownloadURL();
            fileName = file.name;
            setStatus('File uploaded successfully. Saving post metadata...', 'info');
        }

        // 2. Save Post Metadata to Firestore
        await uploadsCollection.add({
            title: title,
            type: type,
            description: description,
            fileURL: fileURL,
            // Saving the file name is essential for deletion
            fileName: fileName, 
            date: new Date().toLocaleDateString(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        setStatus('Post successfully published to Student Portal!', 'success');
        
        // 3. Clean up
        uploadForm.reset();
        loadPastPosts(); // Refresh list to show new post

    } catch (error) {
        console.error("Error posting announcement: ", error);
        setStatus(`Post failed: ${error.message}. Check Firebase rules.`, 'error');
    } finally {
        // This runs whether success or failure, ensuring button resets
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Post to Student Portal';
    }
}

// --- DELETE POST LOGIC ---
async function deletePost(docId, postFileName) {
    if (!confirm("Are you sure you want to delete this post? This action cannot be undone.")) return;

    try {
        // 1. Delete File from Storage (if a file was attached)
        if (postFileName && postFileName !== 'null') {
            const storageRef = storage.ref(`announcements/${postFileName}`);
            await storageRef.delete();
        }

        // 2. Delete Document from Firestore
        await uploadsCollection.doc(docId).delete();
        setStatus('Post successfully deleted.', 'success');
        
        // 3. Refresh the list
        loadPastPosts();

    } catch (error) {
        console.error("Error deleting post: ", error);
        setStatus(`Deletion failed: ${error.message}. If the file was not found, the post was still deleted from the list.`, 'error');
    }
}

// --- LOAD PAST POSTS LOGIC (Initial load and list refresh) ---
function loadPastPosts() {
    if (!pastPostsList || !uploadsCollection) return;

    pastPostsList.innerHTML = '<p class="status-info">Fetching past posts...</p>';
    
    uploadsCollection.orderBy("timestamp", "desc").get()
        .then((querySnapshot) => {
            pastPostsList.innerHTML = '';
            
            if (querySnapshot.empty) {
                pastPostsList.innerHTML = '<p class="status-info">No previous posts found.</p>';
                return;
            }
            
            querySnapshot.forEach((doc) => {
                const post = doc.data();
                const docId = doc.id;
                
                const listItem = document.createElement('li');
                listItem.classList.add('post-item');
                
                const fileInfo = post.fileName ? ` - <small>(File: ${post.fileName})</small>` : '';
                
                listItem.innerHTML = `
                    <div>
                        <strong>${post.title}</strong> (${post.type})
                        <small> - Posted on ${post.date}</small>
                        ${fileInfo}
                    </div>
                    <button class="post-delete-btn" data-id="${docId}" data-filename="${post.fileName || ''}">Delete</button>
                `;
                
                pastPostsList.appendChild(listItem);
            });

            // Re-attach event listeners after DOM update
            pastPostsList.querySelectorAll('.post-delete-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const docId = e.target.getAttribute('data-id');
                    const fileName = e.target.getAttribute('data-filename');
                    deletePost(docId, fileName);
                });
            });

        })
        .catch(error => {
            pastPostsList.innerHTML = `<p class="status-error">Error fetching posts: ${error.message}</p>`;
        });
}


document.addEventListener("DOMContentLoaded", () => {
    // Attach listener and load posts only if the form element exists
    if(uploadForm) {
        uploadForm.addEventListener("submit", handleUpload);
        loadPastPosts(); 
    }
});