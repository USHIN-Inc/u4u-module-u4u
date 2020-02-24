/*
  Copyright (C) 2019 by USHIN, Inc.

  This file is part of U4U.

  U4U is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  U4U is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with U4U.  If not, see <https://www.gnu.org/licenses/>.
*/

/*
    hat schema
    {
        name: string,
        id: string,
        settings: {
            textColor: hexadecimal color,
            backgroundColor: hexadecimal color,
            hatIndex: number,
            hatColorIndex: number,
        },
        history: [
          ...
          [
            ...
            {
                id: string,
                uid: string,
                username: string,
                content: string,
                region: string,
                category: string optional,
                subCategory: string optional,
            }
          ]
        ]
    }
*/
import { useState, useEffect, useRef } from 'react';

export default function useSemscreen(selectedHat, setSelectedHat, me) {
  const { settings, name } = selectedHat;
  const [currentPoints, setCurrentPoints] = useState(
    selectedHat.history.length - 1
  );
  const [points, setPoints] = useState(selectedHat.history[currentPoints]);

  // update point array on history modification
  const currentHistory = useRef(selectedHat.id);
  useEffect(() => {
    if (currentHistory.current !== selectedHat.id) {
      currentHistory.current = selectedHat.id;
      setCurrentPoints(selectedHat.history.length - 1);
    }
    if (currentPoints < selectedHat.history.length) {
      setPoints(selectedHat.history[currentPoints]);
    }
  }, [selectedHat.history, currentPoints, selectedHat.id]);

  function _updatePointsArray(newPointsArray) {
    const newHistory = selectedHat.history.map((h, i) => {
      if (i === currentPoints) {
        return newPointsArray;
      }
      return h;
    });
    setSelectedHat({
      ...selectedHat,
      history: newHistory,
    });
  }

  function switchHistory(index) {
    if (typeof index !== 'number' || index >= selectedHat.history.length) {
      alert('error');
      return;
    }
    setCurrentPoints(index);
  }

  function putHatOn(pointId, hat) {
    // search for the point
    const point = points.find(p => p.id === pointId);
    // put hat on
    point.hat = hat;
    // save new changes
    _updatePointsArray([...points.filter(p => p.id !== pointId), point]);
  }

  function createPoint(newPoint) {
    const newArray = [
      ...points,
      { ...newPoint, uid: me.uid, username: me.username },
    ];
    _updatePointsArray(newArray);
  }

  function updatePoint(pointId, data) {
    // search point
    const point = points.find(p => p.id === pointId);
    // spread data into point to update
    const newPoint = {
      ...point,
      ...data,
    };
    // save new point
    const newPointsArray = points.map(p => {
      if (p.id === pointId) {
        return newPoint;
      }
      return p;
    });
    _updatePointsArray(newPointsArray);
  }

  function destroyPoint(pointId) {
    // filter the points array
    const newPointsArray = points.filter(p => p.id !== pointId);
    // save the new array
    _updatePointsArray(newPointsArray);
  }

  function updateSettings(newSettings) {
    setSelectedHat({
      ...selectedHat,
      settings: {
        ...settings,
        ...newSettings,
      },
    });
  }

  return {
    name,
    id: selectedHat.id,
    points,
    putHatOn,
    destroyPoint,
    updatePoint,
    createPoint,
    settings,
    updateSettings,
    timeTravel: {
      versions: selectedHat.versions,
      currentPoints,
      switchHistory,
      historyLength: selectedHat.history.length,
    },
  };
}
