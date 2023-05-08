const resolveStreamResponse = async (fetchPromise, onStreaming, onFailed, onFinished) => {
  console.log(fetchPromise);
    fetchPromise.catch(err => {
      onFailed(err)
    })
  
    const response = await fetchPromise
    const reader = response.body.getReader();
    while (true) {
      const { value, done } = await reader.read();
      const utf8Decoder = new TextDecoder('utf-8');
      let data = value ? utf8Decoder.decode(value, { stream: true }) : '';
      console.log(data);
      try {
        data = data.replaceAll(`data: `, '').replaceAll('[DONE]', '').split('\n').filter(_ => _ !== '').map(_ => JSON.parse(_))
        data.forEach(_=>onStreaming(_))
      } catch (e) {
        onFailed(e);
      }
      if (done) {
        onFinished()
        break;
      }
    }
}
  
export default resolveStreamResponse