// Runtime geographic assets grouped by state.

export const MAP_ASSETS = {
  himachal: {
    boundary:
      '/data/states/himachal/geospatial/boundaries/HP_State_Boundary.geojson',
    route:
      '/data/states/himachal/geospatial/routes/Bharmour_Darcha_HP_Route.geojson',
    storyRoute:
      '/data/states/himachal/geospatial/routes/HP_Story_Route_Final.geojson',
    storyPoints:
      '/data/states/himachal/geospatial/points/HP_Story_Route_Points.geojson',
    shearing:
      '/data/states/himachal/geospatial/context/Shearing_Locations.geojson',
    rivers:
      '/data/states/himachal/geospatial/rivers/HP_Rivers.geojson',
    temple:
      '/data/states/himachal/geospatial/context/Kartik_Swami_Temple_WGS84.geojson',
    sanctuary:
      '/data/states/himachal/geospatial/context/Kugti_WS_WGS84.geojson',
    miniMap: {
      context: {
        boundary: {
          url:
            '/data/states/himachal/geospatial/boundaries/HP_State_Boundary.geojson'
        }
      },
      routes: {
        summer: {
          url:
            '/data/states/himachal/geospatial/routes/Bharmour_Darcha_HP_Route.geojson',
          color: '#f18700',
          width: 2.2,
          opacity: 0.38
        },
        winter: {
          url:
            '/data/states/himachal/geospatial/routes/HP_Story_Route_Final.geojson',
          color: '#55aadd',
          width: 2,
          opacity: 0.34,
          dasharray: [2, 2],
          reverse: true
        }
      },
      defaultRoute: 'summer',
      // Match the standalone Himachal mini-map's initial north-up view and
      // its final route-only fitBounds padding. Other states can configure
      // these independently on their own miniMap profiles.
      center: [76.7, 32.15],
      zoom: 7,
      padding: 30
    }
  },

  ladakh: {
    boundary:
      '/data/states/ladakh/geospatial/boundaries/Ladakh_Boundary.geojson',
    points:
      '/data/states/ladakh/geospatial/points/individual_1.geojson',
    route:
      '/data/states/ladakh/geospatial/routes/Ladakh_Path.geojson',
    storyPoints:
      '/data/states/ladakh/geospatial/points/Ladakh_RP.geojson',
    miniMap: {
      context: {
        boundary: {
          url: '/data/states/ladakh/geospatial/boundaries/Ladakh_Boundary.geojson'
        }
      },
      routes: {
        primary: {
          url: '/data/states/ladakh/geospatial/routes/Ladakh_Path.geojson',
          color: '#e8ad4f'
        }
      },
      defaultRoute: 'primary'
    },
    seasonalRaster: {
      tiles:
        '/data/states/ladakh/geospatial/boundaries/{z}/{x}/{y}.png',
      bounds: [
        77.16796875,
        32.026706293336126,
        79.892578125,
        34.813803317113134
      ],
      minzoom: 12,
      maxzoom: 12
    }
  },

  arunachal: {
    boundary:
      '/data/states/arunachal/geospatial/boundaries/AR_State_Boundary.geojson',
    miniMap: {
      enabled: false,
      context: {
        boundary: {
          url:
            '/data/states/arunachal/geospatial/boundaries/AR_State_Boundary.geojson'
        }
      },
      routes: {}
    }
  }
};
