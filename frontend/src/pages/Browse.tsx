import { MediaRow } from '../components/MediaRow';

function Browse() {
  const items = [
    "https://image.pbs.org/video-assets/1pESPQP-asset-mezzanine-16x9-ZsGrPRn.jpg?format=webp&resize=316x177",
    "https://image.pbs.org/video-assets/1pESPQP-asset-mezzanine-16x9-ZsGrPRn.jpg?format=webp&resize=316x177",
    "https://image.pbs.org/video-assets/1pESPQP-asset-mezzanine-16x9-ZsGrPRn.jpg?format=webp&resize=316x177",
    "https://image.pbs.org/video-assets/1pESPQP-asset-mezzanine-16x9-ZsGrPRn.jpg?format=webp&resize=316x177",
    "https://image.pbs.org/video-assets/1pESPQP-asset-mezzanine-16x9-ZsGrPRn.jpg?format=webp&resize=316x177",
    "https://image.pbs.org/video-assets/1pESPQP-asset-mezzanine-16x9-ZsGrPRn.jpg?format=webp&resize=316x177",
    "https://image.pbs.org/video-assets/1pESPQP-asset-mezzanine-16x9-ZsGrPRn.jpg?format=webp&resize=316x177",
    "https://image.pbs.org/video-assets/1pESPQP-asset-mezzanine-16x9-ZsGrPRn.jpg?format=webp&resize=316x177",
    "https://image.pbs.org/video-assets/1pESPQP-asset-mezzanine-16x9-ZsGrPRn.jpg?format=webp&resize=316x177",
    "https://image.pbs.org/video-assets/1pESPQP-asset-mezzanine-16x9-ZsGrPRn.jpg?format=webp&resize=316x177"
  ];

  return (
    <div style={{ marginTop: 120 }}>
      <MediaRow title="PBS Wisconsin Shows" items={items} />
      <MediaRow title="PBS Wisconsin Shows" items={items} />
      <MediaRow title="PBS Wisconsin Shows" items={items} />
      <MediaRow title="PBS Wisconsin Shows" items={items} />
    </div>
  )
}

export default Browse

