"use client";

import { useEffect, useMemo, useState } from "react";

const contentTypes = [
  { id: "collect", label: "소장품", listKey: "items" },
  { id: "figures", label: "인물", listKey: "items" },
  { id: "videos", label: "영상", listKey: "sections" },
];

const uploadTargets = {
  cover: "flowImg",
  portrait: "figures",
  thumbnail: "videoThumb",
  video: "video",
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getItemTitle(type, item, index) {
  if (type === "collect") {
    return `${item.year || ""} ${item.titleKo || "제목 없음"} ${item.type || ""}`.trim();
  }

  if (type === "figures") {
    return `${item.name || "이름 없음"} ${item.Occupation || ""}`.trim();
  }

  return item.title || `섹션 ${index + 1}`;
}

function TextInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="adminField">
      <span>{label}</span>
      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({ label, value, onChange }) {
  return (
    <label className="adminField adminFieldWide">
      <span>{label}</span>
      <textarea
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        rows={6}
      />
    </label>
  );
}

function UploadField({ label, value, target, token, onUploaded }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("target", target);
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: token ? { "x-admin-token": token } : undefined,
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "UPLOAD_FAILED");
      }

      onUploaded(result.path);
    } catch (error) {
      alert(`업로드 실패: ${error.message}`);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <label className="adminField adminUpload">
      <span>{label}</span>
      <div>
        <input value={value ?? ""} onChange={(event) => onUploaded(event.target.value)} />
        <input type="file" onChange={handleUpload} disabled={uploading} />
      </div>
    </label>
  );
}

function CollectionEditor({ item, updateItem, token }) {
  const media = item.media || {};

  return (
    <div className="adminEditorGrid">
      <TextInput label="연도" value={item.year} onChange={(value) => updateItem("year", Number(value) || value)} />
      <TextInput label="국문 제목" value={item.titleKo} onChange={(value) => updateItem("titleKo", value)} />
      <TextInput label="영문 제목" value={item.titleEn} onChange={(value) => updateItem("titleEn", value)} />
      <TextInput label="시리얼" value={item.serial} onChange={(value) => updateItem("serial", value)} />
      <TextInput label="유형" value={item.type} onChange={(value) => updateItem("type", value)} />
      <TextInput label="크기" value={item.size} onChange={(value) => updateItem("size", value)} />
      <TextInput label="수량" value={item.quantity} onChange={(value) => updateItem("quantity", Number(value) || value)} />
      <TextInput label="페이지" value={item.pageCount} onChange={(value) => updateItem("pageCount", Number(value) || value)} />
      <TextInput label="기증자" value={item.donor} onChange={(value) => updateItem("donor", value)} />
      <UploadField
        label="커버 이미지"
        value={media.cover || ""}
        target={uploadTargets.cover}
        token={token}
        onUploaded={(path) => updateItem("media", { ...media, cover: path })}
      />
    </div>
  );
}

function FigureEditor({ item, updateItem, token }) {
  const media = item.media || {};

  return (
    <div className="adminEditorGrid">
      <TextInput label="인덱스" value={item.idx} onChange={(value) => updateItem("idx", Number(value) || value)} />
      <TextInput label="이름" value={item.name} onChange={(value) => updateItem("name", value)} />
      <TextInput label="영문 키" value={item.nameEn} onChange={(value) => updateItem("nameEn", value)} />
      <TextInput label="직업" value={item.Occupation} onChange={(value) => updateItem("Occupation", value)} />
      <TextInput label="연도" value={item.Year} onChange={(value) => updateItem("Year", value)} />
      <TextArea label="설명" value={item.Desc} onChange={(value) => updateItem("Desc", value)} />
      <UploadField
        label="인물 이미지"
        value={media.portrait || ""}
        target={uploadTargets.portrait}
        token={token}
        onUploaded={(path) => updateItem("media", { ...media, portrait: path })}
      />
    </div>
  );
}

function VideosEditor({ data, setData, token }) {
  const sections = data.sections || [];

  const updateSection = (sectionIndex, key, value) => {
    const next = clone(data);
    next.sections[sectionIndex][key] = value;
    setData(next);
  };

  const updateVideo = (sectionIndex, videoIndex, key, value) => {
    const next = clone(data);
    next.sections[sectionIndex].videos[videoIndex][key] = value;
    setData(next);
  };

  const addVideo = (sectionIndex) => {
    const next = clone(data);
    next.sections[sectionIndex].videos.push({
      id: String(Date.now()),
      name: "새 영상",
      thumbnail: "",
      video: "",
      enabled: true,
    });
    setData(next);
  };

  const removeVideo = (sectionIndex, videoIndex) => {
    if (!confirm("이 영상을 삭제할까요?")) return;
    const next = clone(data);
    next.sections[sectionIndex].videos.splice(videoIndex, 1);
    setData(next);
  };

  const addSection = () => {
    const next = clone(data);
    next.sections = next.sections || [];
    next.sections.push({ id: `section-${Date.now()}`, title: "새 섹션", videos: [] });
    setData(next);
  };

  return (
    <div className="adminVideoEditor">
      <TextInput
        label="영상 페이지 제목"
        value={data.title}
        onChange={(value) => setData({ ...data, title: value })}
      />
      {sections.map((section, sectionIndex) => (
        <section className="adminVideoSection" key={section.id || sectionIndex}>
          <div className="adminSectionHead">
            <TextInput
              label="섹션 ID"
              value={section.id}
              onChange={(value) => updateSection(sectionIndex, "id", value)}
            />
            <TextInput
              label="섹션 제목"
              value={section.title}
              onChange={(value) => updateSection(sectionIndex, "title", value)}
            />
            <button type="button" onClick={() => addVideo(sectionIndex)}>
              영상 추가
            </button>
          </div>
          {(section.videos || []).map((video, videoIndex) => (
            <div className="adminVideoItem" key={video.id || videoIndex}>
              <TextInput
                label="ID"
                value={video.id}
                onChange={(value) => updateVideo(sectionIndex, videoIndex, "id", value)}
              />
              <TextInput
                label="이름"
                value={video.name}
                onChange={(value) => updateVideo(sectionIndex, videoIndex, "name", value)}
              />
              <UploadField
                label="썸네일"
                value={video.thumbnail}
                target={uploadTargets.thumbnail}
                token={token}
                onUploaded={(path) => updateVideo(sectionIndex, videoIndex, "thumbnail", path)}
              />
              <UploadField
                label="영상 MP4"
                value={video.video}
                target={uploadTargets.video}
                token={token}
                onUploaded={(path) => updateVideo(sectionIndex, videoIndex, "video", path)}
              />
              <label className="adminCheck">
                <input
                  type="checkbox"
                  checked={video.enabled !== false}
                  onChange={(event) =>
                    updateVideo(sectionIndex, videoIndex, "enabled", event.target.checked)
                  }
                />
                활성
              </label>
              <button type="button" onClick={() => removeVideo(sectionIndex, videoIndex)}>
                삭제
              </button>
            </div>
          ))}
        </section>
      ))}
      <button type="button" onClick={addSection}>
        섹션 추가
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [activeType, setActiveType] = useState("collect");
  const [dataMap, setDataMap] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [status, setStatus] = useState("준비됨");

  const activeConfig = useMemo(
    () => contentTypes.find((type) => type.id === activeType),
    [activeType],
  );
  const activeData = dataMap[activeType];
  const items = activeData?.[activeConfig?.listKey] || [];
  const selectedItem = items[selectedIndex];

  useEffect(() => {
    setToken(window.localStorage.getItem("adminToken") || "");
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      setStatus("불러오는 중");
      try {
        const response = await fetch(`/api/content/${activeType}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "LOAD_FAILED");
        }

        setDataMap((prev) => ({ ...prev, [activeType]: data }));
        setSelectedIndex(0);
        setStatus("불러옴");
      } catch (error) {
        setStatus(`오류: ${error.message}`);
      }
    };

    loadContent();
  }, [activeType]);

  const persistToken = (value) => {
    setToken(value);
    window.localStorage.setItem("adminToken", value);
  };

  const setActiveData = (nextData) => {
    setDataMap((prev) => ({ ...prev, [activeType]: nextData }));
  };

  const updateSelectedItem = (key, value) => {
    const next = clone(activeData);
    next[activeConfig.listKey][selectedIndex][key] = value;
    setActiveData(next);
  };

  const saveContent = async () => {
    setStatus("저장 중");
    try {
      const response = await fetch(`/api/content/${activeType}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "x-admin-token": token } : {}),
        },
        body: JSON.stringify(activeData),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "SAVE_FAILED");
      }

      setStatus("저장 완료");
    } catch (error) {
      setStatus(`저장 실패: ${error.message}`);
    }
  };

  const addItem = () => {
    if (activeType === "videos") return;
    const next = clone(activeData);
    const template =
      activeType === "collect"
        ? { year: "", titleKo: "새 소장품", titleEn: "", serial: "", type: "", size: "", quantity: 1, pageCount: "", donor: "" }
        : { idx: Date.now(), name: "새 인물", nameEn: "", Occupation: "", Year: "", Desc: "" };

    next[activeConfig.listKey].push(template);
    setActiveData(next);
    setSelectedIndex(next[activeConfig.listKey].length - 1);
  };

  const removeItem = () => {
    if (activeType === "videos" || !selectedItem) return;
    if (!confirm("선택한 항목을 삭제할까요?")) return;

    const next = clone(activeData);
    next[activeConfig.listKey].splice(selectedIndex, 1);
    setActiveData(next);
    setSelectedIndex(Math.max(0, selectedIndex - 1));
  };

  return (
    <main className="adminShell">
      <aside className="adminSidebar">
        <h1>OM Kiosk Admin</h1>
        <label className="adminField">
          <span>관리 토큰</span>
          <input
            type="password"
            value={token}
            onChange={(event) => persistToken(event.target.value)}
            placeholder="ADMIN_TOKEN"
          />
        </label>
        <div className="adminTabs">
          {contentTypes.map((type) => (
            <button
              type="button"
              className={activeType === type.id ? "active" : ""}
              key={type.id}
              onClick={() => setActiveType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
        {activeType !== "videos" && (
          <div className="adminList">
            {items.map((item, index) => (
              <button
                type="button"
                className={selectedIndex === index ? "active" : ""}
                key={`${activeType}-${index}`}
                onClick={() => setSelectedIndex(index)}
              >
                {getItemTitle(activeType, item, index)}
              </button>
            ))}
          </div>
        )}
      </aside>

      <section className="adminMain">
        <div className="adminToolbar">
          <div>
            <strong>{activeConfig?.label}</strong>
            <span>{status}</span>
          </div>
          <div>
            {activeType !== "videos" && (
              <>
                <button type="button" onClick={addItem}>
                  추가
                </button>
                <button type="button" onClick={removeItem}>
                  삭제
                </button>
              </>
            )}
            <button type="button" className="primary" onClick={saveContent} disabled={!activeData}>
              저장
            </button>
          </div>
        </div>

        {!activeData && <p className="adminEmpty">콘텐츠를 불러오는 중입니다.</p>}

        {activeData && activeType === "collect" && selectedItem && (
          <CollectionEditor item={selectedItem} updateItem={updateSelectedItem} token={token} />
        )}

        {activeData && activeType === "figures" && selectedItem && (
          <FigureEditor item={selectedItem} updateItem={updateSelectedItem} token={token} />
        )}

        {activeData && activeType === "videos" && (
          <VideosEditor data={activeData} setData={setActiveData} token={token} />
        )}
      </section>
    </main>
  );
}
