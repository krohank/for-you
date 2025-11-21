from pytube import YouTube
from moviepy.editor import AudioFileClip
import os

def download_mp3(url):
    output_path = r"C:\Users\rohan\Downloads\\"
    try:
        yt = YouTube(url)

        print("Downloading audio...")
        audio_stream = yt.streams.filter(only_audio=True).first()
        downloaded_file = audio_stream.download(output_path=output_path)

        print("Converting to mp3...")
        mp3_file = os.path.splitext(downloaded_file)[0] + ".mp3"

        clip = AudioFileClip(downloaded_file)
        clip.write_audiofile(mp3_file)
        clip.close()

        print("MP3 saved at:", mp3_file)
    except Exception as e:
        print("Error:", e)

# --------------------------
# ADD THIS ↓↓↓↓↓↓↓↓
# --------------------------
download_mp3("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
