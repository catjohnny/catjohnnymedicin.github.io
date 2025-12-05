import { Drug } from './types';

export const DRUG_DATA: Drug[] = [
  {
    id: 'aspirin',
    name: 'Aspirin',
    dosage: '3顆',
    action: '需做EKG',
    actionDetail: '口服 3顆(300mg) 絞碎吞下',
    checklist: [
      { id: 'asp_1', label: '病患對阿斯匹林類過敏' },
      { id: 'asp_2', label: '病患有嚴重貧血、凝血缺陷或服用抗凝血劑' },
      { id: 'asp_3', label: '病患有出血點、大片瘀血或疑似活動性病理性出血(例如:主動脈剝離、消化道出血)' },
      { id: 'asp_4', label: '病患有顱內出血病史' },
      { id: 'asp_5', label: '需雙側肢體脈壓差 <20mmHg', isBold: true },
    ],
  },
  {
    id: 'ntg',
    name: 'NTG最多',
    dosage: '3顆',
    action: 'T2可協助給予',
    actionDetail: '口服 3顆(300mg) 絞碎吞下',
    checklist: [
      { id: 'ntg_1', label: '收縮壓 <90mmHg', isBold: true },
      { id: 'ntg_2', label: '脈搏 <50 次/分鐘', isBold: true },
      { id: 'ntg_3', label: '服用中西壯陽藥者' },
      { id: 'ntg_4', label: '對NTG過敏' },
      { id: 'ntg_5', label: '需做12導程ECG' },
      { id: 'ntg_6', label: '右心衰竭者(如有頸靜脈怒張或下肢嚴重水腫等症狀)' },
    ],
  },
  {
    id: 'ticagrelor',
    name: 'Ticagrelor',
    dosage: '2顆',
    action: '需致電MD確認',
    actionDetail: '通知線上醫導 口服 2顆(180mg) 絞碎吞下',
    checklist: [
      { id: 'tic_1', label: '病患對 Ticagrelor (Brilinta)類過敏' },
      { id: 'tic_2', label: '病患有嚴重貧血、凝血缺陷或服用抗凝血劑' },
      { id: 'tic_3', label: '病患有出血點、大片瘀血或疑似活動性病理性出血(例如:主動脈剝離、消化道出血)' },
      { id: 'tic_4', label: '病患有顱內出血病史' },
      { id: 'tic_5', label: '病患有嚴重肝功能不全' },
    ],
  },
];
