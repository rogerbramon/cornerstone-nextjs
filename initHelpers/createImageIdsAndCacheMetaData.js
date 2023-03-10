import { api } from 'dicomweb-client';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';

import WADORSHeaderProvider from './WADORSHeaderProvider';

const VOLUME = 'volume';
const STACK = 'stack';

/**
 * Uses dicomweb-client to fetch metadata of a study, cache it in cornerstone,
 * and return a list of imageIds for the frames.
 *
 * Uses the app config to choose which study to fetch, and which
 * dicom-web server to fetch it from.
 *
 * @returns {string[]} An array of imageIds for instances in the study.
 */

export default async function createImageIdsAndCacheMetaData({
  StudyInstanceUID,
  SeriesInstanceUID,
  wadoRsRoot,
  type,
}) {
  const SOP_INSTANCE_UID = '00080018';
  const SERIES_INSTANCE_UID = '0020000E';
  const MODALITY = '00080060';

  const studySearchOptions = {
    studyInstanceUID: StudyInstanceUID,
    seriesInstanceUID: SeriesInstanceUID,
  };

  const client = new api.DICOMwebClient({ url: wadoRsRoot });
  const instances = await client.retrieveSeriesMetadata(studySearchOptions);
  const modality = instances[0][MODALITY].Value[0];
  console.log(cornerstoneWADOImageLoader)
  const imageIds = instances.map((instanceMetaData) => {
    const SeriesInstanceUID = instanceMetaData[SERIES_INSTANCE_UID].Value[0];
    const SOPInstanceUID = instanceMetaData[SOP_INSTANCE_UID].Value[0];

    const prefix = type === VOLUME ? 'streaming-wadors:' : 'wadors:';

    const imageId =
      prefix +
      wadoRsRoot +
      '/studies/' +
      StudyInstanceUID +
      '/series/' +
      SeriesInstanceUID +
      '/instances/' +
      SOPInstanceUID +
      '/frames/1';

    cornerstoneWADOImageLoader.wadors.metaDataManager.add(
      imageId,
      instanceMetaData
    );

    WADORSHeaderProvider.addInstance(imageId, instanceMetaData);

    // // Add calibrated pixel spacing
    // const m = JSON.parse(JSON.stringify(instanceMetaData));
    // const instance = DicomMetaDictionary.naturalizeDataset(m);
    // console.log(instance)
    // const pixelSpacing = getPixelSpacingInformation(instance);

    // calibratedPixelSpacingMetadataProvider.add(
    //   imageId,
    //   pixelSpacing.map((s) => parseFloat(s))
    // );

    return imageId;
  });

  return imageIds;
}
