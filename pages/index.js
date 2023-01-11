import { useEffect } from "react";
import { useState } from "react";

export default function Cornerstone() {
  const [ initCornerstone, setInitCornerstone ] = useState(false);
  
  const initCornerstoneFn = async () => {
    const { init } = await import('../initHelpers/init');
    await init();
    const createImageIdsAndCacheMetaData = await import('../initHelpers/createImageIdsAndCacheMetaData').then(m => m.default);
    const {
      RenderingEngine,
      Enums,
    } = await import('@cornerstonejs/core');

    const { ViewportType } = Enums;

    //Get Cornerstone imageIds and fetch metadata into RAM
    const imageIds = await createImageIdsAndCacheMetaData({
      StudyInstanceUID:
        '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
      SeriesInstanceUID:
        '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
      wadoRsRoot: 'https://d1qmxk7r72ysft.cloudfront.net/dicomweb',
      type: 'VOLUME',
    });

    const content = document.getElementById('content');
    const element = document.createElement('div');
    element.style.width = '500px';
    element.style.height = '500px';

    content.appendChild(element);

    const renderingEngineId = 'myRenderingEngine';
    const viewportId = 'CT_AXIAL_STACK';
    const renderingEngine = new RenderingEngine(renderingEngineId);

    const viewportInput = {
      viewportId,
      element,
      type: ViewportType.STACK,
    };

    renderingEngine.enableElement(viewportInput);

    const viewport = renderingEngine.getViewport(viewportInput.viewportId);

    viewport.setStack(imageIds, 60);
    viewport.render();
  }

  useEffect(() => {
    setInitCornerstone(true);
  }, [])

  useEffect(() => {
    if (!initCornerstone) return;
    const loadCornerstone = async () => {
      await initCornerstoneFn();
    }
    loadCornerstone();
  }, [initCornerstone])

  return (
    <>
      <div id='content'>
        Cornerstone
      </div>
    </>
  )
}