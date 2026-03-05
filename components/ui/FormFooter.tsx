import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { ButtonAction } from "@/components/ui/ButtonAction";

type FormFooterProps = {
  onBack: () => void;
  onContinue: () => void;
  disableContinue?: boolean;
  continueLabel?: string;
};

export function FormFooter({
  onBack,
  onContinue,
  disableContinue,
  continueLabel = "Save & Continue",
}: FormFooterProps) {
  return (
    <footer className="form-footer">
      <ButtonAction
        variant="tertiary"
        size="md"
        cta
        onClick={onBack}
        leftIcon={<CaretLeft size={16} weight="bold" />}
      >
        Back
      </ButtonAction>
      <ButtonAction
        variant="primary"
        size="md"
        cta
        onClick={onContinue}
        disabled={disableContinue}
        rightIcon={<CaretRight size={20} weight="bold" />}
      >
        {continueLabel}
      </ButtonAction>
    </footer>
  );
}
