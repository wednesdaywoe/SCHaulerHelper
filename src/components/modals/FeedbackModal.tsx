import { useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useMissionStore } from '@/stores/missionStore';
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

const FEEDBACK_API_URL =
  'https://hauler-helper-feedback.wedswoe.workers.dev';

type FeedbackType = 'bug' | 'suggestion' | 'other';
type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

function useAppContext() {
  const { selectedShip, selectedSystem, selectedCategory, missions } =
    useMissionStore();
  const theme = useUIStore((s) => s.theme);

  return {
    page: 'Mission Planner',
    ship: selectedShip?.name ?? 'None',
    system: selectedSystem || 'All',
    category: selectedCategory || 'All',
    theme,
    missionCount: missions.length,
    missions: missions.map((mission, index) => ({
      missionNumber: index + 1,
      missionId: mission.id,
      payout: mission.payout,
      commodities: mission.commodities.map((c) => ({
        commodity: c.commodity,
        pickup: c.pickup,
        destination: c.destination,
        quantity: c.quantity,
        maxBoxSize: c.maxBoxSize,
      })),
    })),
  };
}

export function FeedbackModal() {
  const isOpen = useUIStore((s) => s.feedbackModalOpen);
  const closeModal = useUIStore((s) => s.closeFeedbackModal);
  const appContext = useAppContext();

  const [type, setType] = useState<FeedbackType>('bug');
  const [description, setDescription] = useState('');
  const [spectrumHandle, setSpectrumHandle] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (description.length < 10) return;
    setStatus('sending');

    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          description,
          spectrumHandle: spectrumHandle || undefined,
          appContext,
          userAgent: navigator.userAgent,
          source: 'hauler-helper-react',
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setStatus('error');
        setErrorMsg('Failed to send feedback. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please check your connection.');
    }
  };

  const handleClose = () => {
    setType('bug');
    setDescription('');
    setSpectrumHandle('');
    setStatus('idle');
    setErrorMsg('');
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Feedback" size="md">
      <ModalBody>
        <div className="space-y-3">
          <Select
            label="Type"
            value={type}
            onChange={(e) => setType(e.target.value as FeedbackType)}
          >
            <option value="bug">Bug Report</option>
            <option value="suggestion">Suggestion</option>
            <option value="other">Other</option>
          </Select>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)] font-medium">
              Description (min 10 characters)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the issue or suggestion..."
              className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] resize-y"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-[var(--text-secondary)] font-medium">
              Spectrum handle (optional)
            </label>
            <input
              type="text"
              value={spectrumHandle}
              onChange={(e) => setSpectrumHandle(e.target.value)}
              placeholder="YourHandle"
              className="bg-[var(--bg-tertiary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Diagnostic context preview */}
          <div className="rounded-md border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 text-xs text-[var(--text-secondary)]">
            <div className="font-medium mb-1">
              The following info will be included with your report:
            </div>
            <div className="space-y-0.5">
              <div><span className="text-[var(--text-primary)]">Ship:</span> {appContext.ship}</div>
              <div><span className="text-[var(--text-primary)]">System:</span> {appContext.system}</div>
              <div><span className="text-[var(--text-primary)]">Category:</span> {appContext.category}</div>
              <div><span className="text-[var(--text-primary)]">Theme:</span> {appContext.theme}</div>
              <div><span className="text-[var(--text-primary)]">Missions:</span> {appContext.missionCount}</div>
            </div>
          </div>

          {status === 'success' && (
            <p className="text-sm text-[var(--color-success)]">
              Feedback sent. Thank you!
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-[var(--color-danger)]">{errorMsg}</p>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={description.length < 10 || status === 'sending'}
        >
          {status === 'sending' ? 'Sending...' : 'Send Feedback'}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
