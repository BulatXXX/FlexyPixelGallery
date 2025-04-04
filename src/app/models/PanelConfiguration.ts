export interface PanelConfiguration {
  config_id: string;
  name: string;
  author_id: string;
  panel_numbers: number;
  in_gallery: boolean;
  animated: boolean;
  frame_numbers: number;
  // metadata: PanelConfigurationMetaData | null;
}

export interface PanelConfigurationMetaData {
  description: string;
  creation_date: string;
  tags: string[];
  avg_rating: number;
}


//testData

export const panelConfigurations: PanelConfiguration[] = [
  {
    config_id: '1a2b3c4d',
    name: 'Hot Dog Animation',
    author_id: 'user123',
    panel_numbers: 4,
    in_gallery: true,
    animated: true,
    frame_numbers: 10,
  },
  {
    config_id: '2b3c4d5e',
    name: 'Apple Display',
    author_id: 'user456',
    panel_numbers: 2,
    in_gallery: true,
    animated: false,
    frame_numbers: 1,
  },
  {
    config_id: '3c4d5e6f',
    name: 'Night City Lights',
    author_id: 'user789',
    panel_numbers: 6,
    in_gallery: false,
    animated: true,
    frame_numbers: 15,
  },
  {
    config_id: '4d5e6f7g',
    name: 'Ocean Waves',
    author_id: 'user234',
    panel_numbers: 3,
    in_gallery: true,
    animated: true,
    frame_numbers: 20,
  },
  {
    config_id: '5e6f7g8h',
    name: 'Minimalist Art',
    author_id: 'user567',
    panel_numbers: 1,
    in_gallery: false,
    animated: false,
    frame_numbers: 1,
  }
];

