import React, { useState } from "react";
import LeftBar from "../components/LeftBar";
import MainMap from "../components/MainMap";
import { findLayerSetting } from "../components/layerData/layerItems";

export const initialViewState = {
  longitude: 139.7673068,
  latitude: 35.6809591,
  bearing: 0,
  zoom: 10,
  minZoom: 0, //遠景
  maxZoom: 17.499, //近景 地理院地図（ラスター）は17.5未満が最大
  maxPitch: 85,
};
export const defaultLayer = "std";

export default function Home() {
  // const [layerSetting, setLayerSetting] = useState([
  //   findLayerSetting(defaultLayer),
  // ]);

  const [viewState, setViewState] = useState(initialViewState);
  return (
    <>
      <div>xcfvgbhnjmkl,mlbkhvjgchfxcghbkm</div>
      {/* <MainMap
        layerSetting={layerSetting}
        viewState={viewState}
        setViewState={setViewState}
      />
      <LeftBar
        layerSetting={layerSetting}
        setLayerSetting={setLayerSetting}
        setViewState={setViewState}
      /> */}
    </>
  );
}
