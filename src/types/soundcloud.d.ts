declare namespace SoundCloud {
  export interface Search {
    id: number;
    title: string;
    artist: string;
    duration: number;
    artwork: string;
    endpoint: string;
    kind: string;
  }

  export interface Track {
    artwork_url: string;
    caption: string | null;
    commentable: boolean;
    comment_count: number;
    created_at: string;
    description: string | null;
    downloadable: boolean;
    download_count: number;
    duration: number;
    full_duration: number;
    embeddable_by: string;
    genre: string;
    has_downloads_left: boolean;
    id: number;
    kind: string;
    label_name: string;
    last_modified: string;
    license: string;
    likes_count: number;
    permalink: string;
    permalink_url: string;
    playback_count: number;
    public: boolean;
    publisher_metadata: {
      id: number;
      urn: string;
      artist: string;
      album_title: string;
      contains_music: boolean;
      upc_or_ean: string;
      isrc: string;
      explicit: boolean;
      p_line: string;
      p_line_for_display: string;
      c_line: string;
      c_line_for_display: string;
      release_title: string;
    };
    purchase_title: string | null;
    purchase_url: string | null;
    release_date: string;
    reposts_count: number;
    secret_token: string | null;
    sharing: string;
    state: string;
    streamable: boolean;
    tag_list: string;
    title: string;
    uri: string;
    urn: string;
    user_id: number;
    visuals: [];
    waveform_url: string;
    display_date: string;
    media: {
      transcodings: Array<{
        url: string;
        preset: string;
        duration: number;
        snipped: boolean;
        format: {
          protocol: string;
          mime_type: string;
        };
        quality: string;
      }>;
    };
  }
}
