"use client";
import { fetchContent, getFigureImage } from "../lib/content-client";
import { useEffect, useState } from "react";

export default function Individual() {
  const [showInfo, setShowInfo] = useState(false);
  const [selectIdx, setSelectIdx] = useState(0);
  const [figData, setFigData] = useState([]);

  useEffect(() => {
    fetchContent("figures")
      .then((data) => setFigData(data.items || []))
      .catch((error) => {
        console.warn("Failed to load figure content:", error);
      });
  }, []);

  const selectedItem = figData.find((item) => item.idx === selectIdx);

  const handleVisible = (idx) => () => {
    setShowInfo(true);
    setSelectIdx(idx);
  };
  const handleInitialize = () => {
    setShowInfo(false);
    setSelectIdx(0);
  };

  return (
    <div>
      <div className={showInfo ? "figWrap infoIn" : "figWrap"}>
        {figData.map((sequence) => (
          <div
            className={selectIdx === sequence.idx ? "thumb active" : "thumb"}
            key={sequence.idx}
            onClick={handleVisible(sequence.idx)}
          >
            <img
              alt={sequence.nameEn}
              src={getFigureImage(sequence)}
            />
            <span className="occupation">{sequence.Occupation}</span>
            <span className="name">{sequence.name}</span>
          </div>
        ))}
      </div>
      <div className={showInfo ? "moreInfo on" : "moreInfo"}>
        {selectedItem && (
          <div className="infoThumb">
            <img src={getFigureImage(selectedItem)} alt="" />
          </div>
        )}

        {selectedItem && (
          <span className="infoName">
            {selectedItem.Year
              ? selectedItem.name + " (" + selectedItem.Year + ")"
              : selectedItem.name}{" "}
            {selectedItem.Occupation && (
              <span className="occupation">{selectedItem.Occupation}</span>
            )}
          </span>
        )}
        {selectedItem && (
          <ul>
            {selectedItem.Desc.split("\n").map((desc, index) => (
              <li key={index}>{desc}</li> // '\n'을 기준으로 나눈 후 <li>로 감싼다
            ))}
          </ul>
        )}
        <div className="closeBtn" onClick={() => handleInitialize()}></div>
      </div>
    </div>
  );
}
