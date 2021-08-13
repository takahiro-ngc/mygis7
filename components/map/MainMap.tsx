import React, { useState, useCallback } from "react";
import DeckGL from "deck.gl";

import {
  GeoJsonLayer,
  ColumnLayer,
  TextLayer,
  ScatterplotLayer,
} from "@deck.gl/layers";
import { HexagonLayer, ScreenGridLayer } from "@deck.gl/aggregation-layers";
import {
  TileLayer,
  TerrainLayer,
  MVTLayer,
  Tile3DLayer,
} from "@deck.gl/geo-layers";
import { LabeledGeoJsonLayer } from "../components/customLayer";
import { GsiTerrainLayer } from "../utils/deckgl-gsi-terrain-layer/index.js";
import { BitmapLayer } from "@deck.gl/layers";

// コンポーネント
import ClickInfo from "../components/ClickInfo";
import JSONTree from "react-json-tree";

export default function MainMap({ layerSetting, viewState, setViewState }) {
  // https://gbank.gsj.jp/seamless/elev/tile.html
  const SEEMLESS = "https://tiles.gsj.jp/tiles/elev/mixed/{z}/{y}/{x}.png";
  // https://maps.gsi.go.jp/development/hyokochi.html
  const DEM5A =
    "https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png";
  const DEM10B = "https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png";
  const DEMGM =
    "https://cyberjapandata.gsi.go.jp/xyz/demgm_png/{z}/{x}/{y}.png";
  const [elevationData, setElevationData] = useState(DEM10B);
  const autoElevationData = (zoom) =>
    setElevationData(
      "https://tiles.gsj.jp/tiles/elev/gsidem5a/{z}/{y}/{x}.png"
    );
  // setElevationData(zoom >= 13.5 ? DEM5A : zoom >= 7.5 ? DEM10B : DEMGM);

  const layers = layerSetting.map((item, index) => {
    const itemWithSetting = {
      ...item,
      updateTriggers: {
        getFillColor: layerSetting[index]?.getFillColor,
        // all: layerSetting[index].layerType,
      },
      // onDataLoad: (value) => console.log(value),
    };

    switch (item.layerType) {
      case "GeoJsonLayer":
        return new GeoJsonLayer(itemWithSetting);
      case "HexagonLayer":
        return new HexagonLayer(itemWithSetting);
      case "ColumnLayer":
        return new ColumnLayer(itemWithSetting);
      case "TextLayer":
        return new TextLayer(itemWithSetting);
      case "ScreenGridLayer":
        return new ScreenGridLayer(itemWithSetting);
      case "ScatterplotLayer":
        return new ScatterplotLayer(itemWithSetting);
      case "TileLayer":
        return new TileLayer(itemWithSetting);
      case "LabeledGeoJsonLayer":
        return new LabeledGeoJsonLayer(itemWithSetting);
      // https://github.com/Kanahiro/deckgl-gsi-terrain-layer
      case "GsiTerrainLayer":
        return new GsiTerrainLayer({
          ...itemWithSetting,
          elevationData: elevationData,
          maxZoom: 15.99,
        });
      case "MVTLayer":
        return new MVTLayer(itemWithSetting);
      case "GeojsonTileLayer":
        return new TileLayer(itemWithSetting);
      case "Tile3DLayer":
        return new Tile3DLayer(itemWithSetting);
    }
  });

  // https://deck.gl/docs/developer-guide/interactivity#using-the-built-in-event-handling
  const [clickInfo, setClickInfo] = useState(null);
  const onClick = (info) => {
    setClickInfo(info);
    console.log(info);
  };

  // 背景レイヤーがないと，「合成」したときに見えなくなるのを防止
  const backgroundLayer = new BitmapLayer({
    id: "background-layer",
    bounds: [-180, -180, 180, 180],
    image: "/img/white.jpg",
    // 傾けたときにチラつくのを防止
    parameters: {
      depthTest: false,
    },
  });

  return (
    <>
      {/* 右クリックメニュー抑止 */}
      <div onContextMenu={(e) => e.preventDefault()}>
        <DeckGL
          layers={[backgroundLayer, layers]}
          controller={{
            inertia: true,
            scrollZoom: { speed: 0.01, smooth: true },
            touchRotate: true,
          }}
          onClick={onClick}
          viewState={viewState}
          onViewStateChange={({ viewState }) => {
            autoElevationData(viewState.zoom);
            setViewState(viewState);
          }}
          mapStyle="https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json"
        >
          {/* https://deck.gl/docs/api-reference/react/deckgl#render-callbacks */}

          <div
            className="zoom acrylic-color"
            style={{
              position: "fixed",
              padding: "2px 4px",
              bottom: 8,
              right: 8,
              borderRadius: 2,
            }}
          >
            zoom={viewState.zoom.toFixed(0)}
            zoom={viewState.zoom.toFixed(1)}
          </div>
        </DeckGL>
      </div>

      <ClickInfo info={clickInfo} setClickInfo={setClickInfo}></ClickInfo>
    </>
  );
}
