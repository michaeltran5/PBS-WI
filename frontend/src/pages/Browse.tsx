import { Banner } from '../components/Banner';
import { MediaRow } from '../components/MediaRow';
import { Link } from 'react-router-dom';

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

  const showIds = [
    "0323ec58-dfdb-4fc1-aa0e-6ba11bc176b1",
    "0323ec58-dfdb-4fc1-aa0e-6ba11bc176b1",
    "0323ec58-dfdb-4fc1-aa0e-6ba11bc176b1"
  ];

  return (
      <div style={{ marginTop: 73 }}>
        <div style={{ position: 'absolute', zIndex: 999 }}>
          <Link to="/watch">
            <button style={{ backgroundColor: '#2638c4', color: 'white', padding: '8px 12px', borderRadius: '4px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
              Media Player
            </button>
          </Link>
        </div>
        <Banner showIds={showIds} />
        <MediaRow title="PBS Wisconsin Shows" items={items} />
        <MediaRow title="PBS Wisconsin Shows" items={items} />
        <MediaRow title="PBS Wisconsin Shows" items={items} />
        <MediaRow title="PBS Wisconsin Shows" items={items} />
      </div>
  )
}

export default Browse

