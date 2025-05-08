// TagsModal.jsx
import React, { useEffect, useState } from "react";
import "../styles/tagsModal.css";
import Button from "../components/Button.jsx";

const TagsModal = ({ isOpen, onClose, workspaceId }) => {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("#000000");

    useEffect(() => {
        if (isOpen && workspaceId) {
            fetchTags();
        }
    }, [isOpen, workspaceId]);

    const fetchTags = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5137/api/workspaces/${workspaceId}/tags`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) throw new Error("Failed to fetch tags");

            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    const handleCreateTag = async () => {
        if (!newTagName.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5137/api/workspaces/${workspaceId}/tags`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newTagName, colorCode: newTagColor }),
            });

            if (!response.ok) throw new Error("Failed to create tag");

            setNewTagName("");
            setNewTagColor("#000000");
            fetchTags();
        } catch (error) {
            console.error("Error creating tag:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="tags-modal-backdrop">
            <div className="tags-modal">
                <div className="tags-modal-header">
                    <h2>Tags Management</h2>
                    {/* <button onClick={onClose}>&times;</button> */}
                    <svg onClick={onClose} class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                    </svg>
                </div>
                <div className="tags-list">
                    {tags.length === 0 ? (
                        <p>No tags available</p>
                    ) : (
                        tags.map((tag) => (
                            <div key={tag.tagId} className="tag-item">
                                {tag.name}
                            </div>
                        ))
                    )}
                </div>
                <div className="create-tag">
                    <input
                        type="text"
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Enter tag name"
                    />
                    <input
                        type="color"
                        value={newTagColor}
                        onChange={(e) => setNewTagColor(e.target.value)}
                        title="Choose Tag Color"
                    />
                    <Button text="Create Tag" color="primary" onClick={handleCreateTag} />
                </div>
            </div>
        </div>
    );
};

export default TagsModal;