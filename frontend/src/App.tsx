import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { MediaRow } from './components/MediaRow';
import { GlobalStyles } from './GlobalStyles';

function App() {
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
    <>
      <div className="app-container">
        <GlobalStyles />
        <MediaRow title="PBS Wisconsin Shows" items={items} />
        <MediaRow title="PBS Wisconsin Shows" items={items} />
        <MediaRow title="PBS Wisconsin Shows" items={items} />
        <MediaRow title="PBS Wisconsin Shows" items={items} />
      </div>
    </>
  )
}

export default App