export const WORLD_VIEWBOX = {
  width: 2752.766,
  height: 1537.631,
};

export interface MapViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function coordinatesToWorldPercent(
  latitude: number,
  longitude: number,
) {
  return {
    x:
      0.27765693 * longitude +
      46.1884822,

    y:
      -0.50286929 * latitude +
      49.17388057,
  };
}

export function worldPositionToViewBoxPercent(
  position: {
    x: number;
    y: number;
  },
  viewBox: MapViewBox,
) {
  const worldX =
    (position.x / 100) *
    WORLD_VIEWBOX.width;

  const worldY =
    (position.y / 100) *
    WORLD_VIEWBOX.height;

  return {
    x:
      ((worldX - viewBox.x) /
        viewBox.width) *
      100,

    y:
      ((worldY - viewBox.y) /
        viewBox.height) *
      100,
  };
}

export function coordinatesToViewBoxPercent(
  latitude: number,
  longitude: number,
  viewBox: MapViewBox,
) {
  const worldPosition =
    coordinatesToWorldPercent(
      latitude,
      longitude,
    );

  return worldPositionToViewBoxPercent(
    worldPosition,
    viewBox,
  );
}