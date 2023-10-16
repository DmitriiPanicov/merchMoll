import { FC } from "react";
import { useSelector } from "react-redux";
import {
  GeolocationControl,
  FullscreenControl,
  TrafficControl,
  SearchControl,
  ObjectManager,
  TypeSelector,
  RulerControl,
  ZoomControl,
  YMaps,
  Map,
} from "@pbe/react-yandex-maps";

import { formatHistoryDateTime } from "../../../utils/formatDate";

const YMAP_API_KEY = process.env.REACT_APP_YMAP_KEY;

const YandexMap: FC = () => {
  const { report, mapPoints } = useSelector(
    (state: any) => state.userSingleReport.userSingleReport
  );

  return (
    <div style={{ borderRadius: "10px", overflow: "hidden" }}>
      <YMaps query={{ apikey: `${YMAP_API_KEY}`, lang: "ru_RU" }}>
        <Map
          defaultState={{
            center: [
              report && report?.pos?.latitude,
              report && report?.pos?.longitude,
            ],
            zoom: 15,
          }}
          style={{ width: "auto", height: "500px" }}
        >
          {mapPoints && (
            <ObjectManager
              objects={{
                openBalloonOnClick: true,
              }}
              options={{
                clusterize: true,
                clusterDisableClickZoom: true,
              }}
              defaultFeatures={{
                type: "FeatureCollection",
                features: mapPoints?.map((point: any, index: any) => {
                  return {
                    id: index,
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: point?.coords,
                    },
                    properties: {
                      balloonContent: `
                  <p>Отчет №${report && report?.reportId?.id}</p>
                  <p>Радиус: ${point?.radius}м</p>
                  <p>Погрешность: ${point?.error}м</p>
                  <p>Растояние до ТТ: ${point?.distance}м</p>
                  <p>Отчет за ${
                    report && report?.expected?.split("-")?.reverse()?.join(".")
                  }</p>
                  <p>Дата ${Object.values(
                    point?.type
                  )}: ${formatHistoryDateTime(point?.date)}</p>
                  <p>Адрес:  ${report && report?.chain}, г.${
                        report && report?.pos?.city
                      }
                  ${", "}
                  ${report && report?.pos?.address}</p>
                  ${
                    point?.isPhoto ? "<p>Создана системой по фото чека</p>" : ""
                  }
              `,
                      clusterCaption: `Отчет №${
                        report && report?.reportId?.id
                      } тип: ${Object.values(point?.type)}`,
                    },
                  };
                }),
              }}
              modules={[
                "objectManager.addon.objectsBalloon",
                "objectManager.addon.clustersBalloon",
              ]}
            />
          )}
          <GeolocationControl />
          <FullscreenControl />
          <TrafficControl />
          <SearchControl />
          <TypeSelector />
          <RulerControl />
          <ZoomControl />
        </Map>
      </YMaps>
    </div>
  );
};

export default YandexMap;
