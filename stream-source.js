let source_url = process.argv[3];
let title = process.argv[4];
let org = process.argv[5];
let url = process.argv[6];

const { broadcastLiveStream } = require('./src/_helpers');
const createLiveStream = require('./src/createLiveStream');
const updateLiveStream = require('./src/updateLiveStream');

!async function() {
  
  try {
    
    let { id, stream_url } = await createLiveStream({
        title,
        description: `${title}\n\nOriginally published from ${org} at ${url}\n#NweOoLive #NweOoBot`,
    });
    let { video_id } = await updateLiveStream(id);
    broadcastLiveStream(source_url, stream_url);
    
  } catch (e) {
    
    console.log(e);
    e.response && console.log(e.response?.headers, e.response?.data);
    console.log(e.message);
    
  }
  
}();
