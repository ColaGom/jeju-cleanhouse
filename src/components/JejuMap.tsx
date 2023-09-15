"use client";

import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useLoadScript,
} from "@react-google-maps/api";
import _ from "lodash";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export type JejuMapProps = {
  items: any[];
};

export const JejuMap = ({ items }: JejuMapProps) => {
  const map = useRef<any>();
  const [selected, setSelected] = useState<any>(null);
  const [center, setCenter] = useState<any>({
    lat: 33.3846216,
    lng: 126.5534925,
  });
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  });

  const findNearest = useCallback(async () => {
    const current: any = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        const current = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(current);
        resolve(current);
      });
    });

    _.minBy(items, (item) => {
      return (
        Math.pow(current.lat - item.lat, 2) +
        Math.pow(current.lng - item.lng, 2)
      );
    });
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
    });
  }, []);

  if (!isLoaded) return <div>loading</div>;

  return (
    <GoogleMap
      ref={map}
      mapContainerClassName="h-screen w-full"
      center={center}
      zoom={11}
    >
      <div className="absolute flex flex-col gap-3 inset-x-0 bottom-0 mx-auto items-center justify-center mb-4">
        <button
          className="bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full"
          onClick={() => {
            findNearest();
          }}
        >
          가까운 클린하우스
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-full"
          onClick={() => {
            navigator.geolocation.getCurrentPosition((position) => {
              setCenter({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            });
          }}
        >
          현재위치보기
        </button>
      </div>
      {items.map((item, index) => {
        return (
          <MarkerF
            key={index}
            position={{ lat: parseFloat(item.lat), lng: parseFloat(item.lng) }}
            animation={google.maps.Animation.DROP}
            clickable={true}
            onClick={() => {
              setSelected(item);
            }}
          />
        );
      })}
      {selected && (
        <InfoWindowF
          onCloseClick={() => setSelected(null)}
          position={{
            lat: parseFloat(selected.lat),
            lng: parseFloat(selected.lng),
          }}
        >
          <div className="flex flex-col p-4 gap-4">
            <p className="text-lg">{selected.address}</p>
            <CopyToClipboard text={selected.address} onCopy={() => {}}>
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Copy
              </button>
            </CopyToClipboard>
            <Link
              href={`https://map.kakao.com/link/to/${selected.address},${selected.lat},${selected.lng}`}
              target="_blank"
            >
              <img src="btn_kakao_navi.png" style={{ cursor: "pointer" }} />
            </Link>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
};
