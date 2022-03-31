import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { List, message, Avatar, Skeleton, Divider, Button, Spin, Form, Input } from 'antd';
import VirtualList from 'rc-virtual-list';
import { followId, getFollowers, getFollowing, unfollowId } from 'src/services/follow-service';
import _ from 'lodash';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap,  } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import icon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const createRoutineMachineLayer = (props) => {
    let x: any = L

    const instance = x.Routing.control({
      // position: 'topright',
      waypoints: [
        // L.latLng(33.52001088075479, 36.26829385757446),
        L.latLng(props?.from?.lat, props?.from?.lng),
        L.latLng(props?.to?.lat, props?.to?.lng)

        // L.latLng(props?.to?.lat, props?.to?.lng)
      ],
      lineOptions: {
        styles: [{ color: "#6FA1EC", weight: 4 }]
      },
      show: true,
      addWaypoints: false,
      routeWhileDragging: true,
      draggableWaypoints: true,
      fitSelectedRoutes: true,
      showAlternatives: true,
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
