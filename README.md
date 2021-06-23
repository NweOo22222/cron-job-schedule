# Cron Job Schedule

## News & Media

- [RFA Burmese](https://www.youtube.com/channel/UCE75dgnEYPacknHHg3a3sJg)
- [VOA Burmese](https://www.youtube.com/channel/UCv-YbGueeYCp8_CdjgXQD3A)
- [DVB TV News](https://www.youtube.com/channel/UCuaRmKJLYaVMDHrnjhWUcHw)
- [Mizzma TV](https://www.youtube.com/channel/UCk9f0cLiMmtchQySOogzoig)

## Actions

- [Live Stream](https://github.com/NweOo22222/cron-job-schedule/actions/workflows/live.yml) `npm:ytdl-core`
- [Live Stream](https://github.com/NweOo22222/cron-job-schedule/actions/workflows/live2.yml) `api:yt1s.com`
- [Upload Video](https://github.com/NweOo22222/cron-job-schedule/actions/workflows/video.yml) `npm:ytdl-core`

### Shortcut

- [RFA Morning](https://github.com/NweOo22222/cron-job-schedule/actions/workflows/rfa-morning.yml)
- [RFA Night](https://github.com/NweOo22222/cron-job-schedule/actions/workflows/rfa-night.yml)
- [VOA Morning](https://github.com/NweOo22222/cron-job-schedule/actions/workflows/voa-morning.yml)
- [VOA Night](https://github.com/NweOo22222/cron-job-schedule/actions/workflows/voa-night.yml)

## CLI Usage

```sh
curl -X 'POST'\
     -H 'Authorization: Bearer <token>'\
     -d '{"ref":"refs/heads/main","inputs":{ "channel":"<channel>", "youtube_id":"<youtube_id>" }}'\
     https://api.github.com/repos/nweoo22222/cron-job-schedule/actions/workflows/<id>/dispatches
```
