import Nav from 'react-bootstrap/Nav';

function Browse() {
    return (
      //temp button to access media player
      <div style={{ position: 'absolute', top: '80px', right: '20px', zIndex: 1000 }}>
      <Nav.Link href="/watch" style={{ backgroundColor: 'transparent', border: '1px solid white', color: 'white', padding: '6px 12px', fontSize: '10px', cursor: 'pointer', borderRadius: '4px', textDecoration: 'none' }}>
        media player(temp)
      </Nav.Link>
    </div>
    )
  }
  
  export default Browse