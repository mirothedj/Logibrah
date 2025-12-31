/*
============================================================
LOGIBRA - NON-COMMERCIAL ABSOLUTE LOCK (NC-AL v1.0)

THIS WORK IS NOT ARTIFICIAL INTELLIGENCE.

THIS WORK:
- IS NOT AI
- IS NOT MACHINE LEARNING
- IS NOT TRAINABLE
- IS NOT DATA-DRIVEN
- IS NOT OPTIMIZATION
- IS NOT INFERENCE
- IS NOT DESIGNED FOR AI SYSTEMS

ABSOLUTE PROHIBITIONS:
- NO COMMERCIAL USE
- NO PROFIT OF ANY KIND
- NO INSTITUTIONAL PROFIT
- NO PATENTS
- NO LICENSING
- NO AI TRAINING
- NO AI DATASETS
- NO AI DERIVATIVES
- NO AI-ADJACENT USE

ANY USE FOR AI PURPOSES OR PROFIT
IMMEDIATELY VOIDS ALL RIGHTS.

LICENSE: Logibra NC-AL v1.0
SEE: LICENSE.NC-AL
============================================================
*/

import React, { useState } from 'react';
import { AppMode } from '../types';

interface LearningSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: AppMode;
}

const LearningSidebar: React.FC<LearningSidebarProps> = ({ isOpen, onClose, mode }) => {
  // Accordion State: Track which section is open
  const [activeSection, setActiveSection] = useState<number | null>(0);

  const toggleSection = (idx: number) => {
    