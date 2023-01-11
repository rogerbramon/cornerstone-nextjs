import * as cornerstone from '@cornerstonejs/core';
import WADORSHeaderProvider from './WADORSHeaderProvider';

const { calibratedPixelSpacingMetadataProvider } = cornerstone.utilities;

export default function initProviders() {
  cornerstone.metaData.addProvider(
    WADORSHeaderProvider.get.bind(WADORSHeaderProvider),
    9999
  );
  cornerstone.metaData.addProvider(
    calibratedPixelSpacingMetadataProvider.get.bind(
      calibratedPixelSpacingMetadataProvider
    ),
    11000
  );
}
