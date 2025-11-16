import { useState, useEffect } from "react";
import "./Page3.css";

function Page3({ notes, addNote, updateNote, deleteNote }) {
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [steps, setSteps] = useState([]);
  const [stepInput, setStepInput] = useState("");
  const [category, setCategory] = useState("general");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [filterTag, setFilterTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedNotes, setExpandedNotes] = useState(() => new Set());

  // ESC 關閉筆記表單
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape" && showForm) {
        resetForm();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showForm]);

  const categories = {
    general: "一般筆記",
    howto: "操作指南",
    tutorial: "教學步驟",
    reference: "參考資料",
    tips: "技巧提示",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const noteData = {
      id: editingNote?.id || Date.now(),
      title: title.trim(),
      content: content.trim(),
      steps: steps,
      category,
      tags: tags,
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData);
      } else {
        await addNote(noteData);
      }
      resetForm();
    } catch (error) {
      alert("操作失敗，請稍後再試");
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSteps([]);
    setStepInput("");
    setCategory("general");
    setTags([]);
    setTagInput("");
    setEditingNote(null);
    setShowForm(false);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content || "");
    setSteps(note.steps || []);
    setCategory(note.category);
    setTags(note.tags || []);
    setShowForm(true);
  };

  const handleAddStep = () => {
    const step = stepInput.trim();
    if (step) {
      setSteps([...steps, step]);
      setStepInput("");
    }
  };

  const handleStepChange = (index, value) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  };

  const handleRemoveStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleMoveStep = (index, direction) => {
    setSteps((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[target];
      next[target] = temp;
      return next;
    });
  };

  const handleStepInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddStep();
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // 獲取所有標籤
  const getAllTags = () => {
    const allTags = new Set();
    notes.forEach((note) => {
      if (note.tags) {
        note.tags.forEach((tag) => allTags.add(tag));
      }
    });
    return Array.from(allTags);
  };

  const handleDelete = async (noteId) => {
    if (!confirm("確定要刪除這個筆記嗎？")) return;
    try {
      await deleteNote(noteId);
    } catch (error) {
      alert("刪除失敗，請稍後再試");
    }
  };

  // 根據標籤和搜尋詞篩選
  const filteredNotes = notes.filter((note) => {
    const matchTag = !filterTag || (note.tags && note.tags.includes(filterTag));
    const matchSearch =
      !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content &&
        note.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchTag && matchSearch;
  });

  const allTags = getAllTags();

  const toggleExpand = (noteId) => {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(noteId)) {
        next.delete(noteId);
      } else {
        next.add(noteId);
      }
      return next;
    });
  };

  return (
    <div className="content-wrapper">
      <div className="page3-container">
        <div className="notes-header">
          <h2>📝 我的筆記</h2>
          <button
            className="add-note-btn"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            + 新增筆記
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="搜尋筆記標題或內容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {showForm && (
          <div className="note-form-overlay">
            <div
              className="note-form-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="note-form-header">
                <h3>{editingNote ? "編輯筆記" : "新增筆記"}</h3>
                <button onClick={resetForm} className="close-btn">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="note-form">
                <div className="form-group">
                  <label>標題 *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例如：如何使用Git、Python基礎教學"
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label>分類</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {Object.entries(categories).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>操作步驟</label>
                  <div className="step-input-container">
                    <input
                      type="text"
                      value={stepInput}
                      onChange={(e) => setStepInput(e.target.value)}
                      onKeyPress={handleStepInputKeyPress}
                      placeholder="輸入步驟後按 Enter，例如：開啟終端機"
                    />
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="add-step-btn"
                    >
                      + 添加步驟
                    </button>
                  </div>
                  {steps.length > 0 && (
                    <div className="steps-display">
                      {steps.map((step, index) => (
                        <div key={index} className="step-item">
                          <span className="step-number">{index + 1}.</span>
                          <input
                            className="step-text-input"
                            value={step}
                            onChange={(e) =>
                              handleStepChange(index, e.target.value)
                            }
                            placeholder="編輯步驟內容"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(index)}
                            className="remove-step-btn"
                          >
                            ×
                          </button>
                          <div className="step-move-buttons">
                            <button
                              type="button"
                              onClick={() => handleMoveStep(index, -1)}
                              className="move-step-btn"
                              title="上移"
                              disabled={index === 0}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveStep(index, 1)}
                              className="move-step-btn"
                              title="下移"
                              disabled={index === steps.length - 1}
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>標籤</label>
                  <div className="tag-input-container">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                      placeholder="輸入標籤後按 Enter，例如：Git、程式設計"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="add-tag-btn"
                    >
                      + 添加
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="tags-display">
                      {tags.map((tag, index) => (
                        <span key={index} className="tag-item">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="remove-tag-btn"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>備註說明</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="補充說明、注意事項或相關資訊（選填）"
                    rows="4"
                  />
                </div>

                <div className="form-buttons">
                  <button type="submit" className="submit-btn">
                    {editingNote ? "更新" : "新增"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="cancel-btn"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="notes-stats">
          <div className="stat-item">
            <span className="stat-number">{filteredNotes.length}</span>
            <span className="stat-label">
              {searchQuery || filterTag ? "符合條件" : "總筆記數"}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{allTags.length}</span>
            <span className="stat-label">標籤數量</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {Object.values(
                filteredNotes.reduce((acc, note) => {
                  acc[note.category] = (acc[note.category] || 0) + 1;
                  return acc;
                }, {}),
              ).sort((a, b) => b - a)[0] || 0}
            </span>
            <span className="stat-label">最多分類</span>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="tags-filter">
            <div className="filter-label">篩選標籤：</div>
            <div className="tags-filter-list">
              <button
                className={`filter-tag ${!filterTag ? "active" : ""}`}
                onClick={() => setFilterTag(null)}
              >
                全部
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`filter-tag ${filterTag === tag ? "active" : ""}`}
                  onClick={() => setFilterTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="notes-section">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              <p>
                {searchQuery || filterTag
                  ? "沒有符合條件的筆記"
                  : "還沒有任何筆記"}
              </p>
              {!searchQuery && !filterTag && (
                <button
                  onClick={() => setShowForm(true)}
                  className="empty-add-btn"
                >
                  新增第一個筆記
                </button>
              )}
            </div>
          ) : (
            <div className="notes-list">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="note-item"
                  onClick={() => toggleExpand(note.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleExpand(note.id);
                    }
                  }}
                >
                  {/*
                    摺疊狀態：只顯示標題/分類/日期與按鈕，需要時再展開內容
                  */}
                  <div className="note-header">
                    <div className="note-title-row">
                      <h4 className="note-title">{note.title}</h4>
                    </div>
                    <div className="note-actions">
                      <button
                        onClick={() => handleEdit(note)}
                        className="edit-btn"
                        title="編輯"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        className="delete-btn"
                        title="刪除"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="note-meta">
                    <span className="category-badge">
                      {categories[note.category]}
                    </span>
                    <span className="note-date">
                      建立：
                      {new Date(note.createdAt).toLocaleDateString("zh-TW")}
                    </span>
                    {note.updatedAt && note.updatedAt !== note.createdAt && (
                      <span className="note-date">
                        更新：
                        {new Date(note.updatedAt).toLocaleDateString("zh-TW")}
                      </span>
                    )}
                  </div>

                  {expandedNotes.has(note.id) && (
                    <>
                      {note.tags && note.tags.length > 0 && (
                        <div className="note-tags">
                          {note.tags.map((tag, index) => (
                            <span key={index} className="note-tag">
                              🏷️ {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {note.steps && note.steps.length > 0 && (
                        <div className="note-steps">
                          <div className="steps-label">操作步驟：</div>
                          {note.steps.map((step, index) => (
                            <div key={index} className="step-display-item">
                              <span className="step-display-number">
                                {index + 1}.
                              </span>
                              <span className="step-display-text">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {note.content && (
                        <div className="note-content-section">
                          <div className="content-label">備註說明：</div>
                          <p className="note-content">{note.content}</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page3;
