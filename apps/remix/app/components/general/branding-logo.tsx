import type { SVGAttributes } from 'react';

export type LogoProps = SVGAttributes<SVGSVGElement>;

export const BrandingLogo = ({ ...props }: LogoProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2248 320" {...props} role="img" aria-label="ProcuSign logo">
      <title>ProcuSign</title>
      <text
        x="50"
        y="220"
        fill="currentColor"
        fontFamily="Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
        fontSize="200"
        fontWeight={700}
      >
        ProcuSign
      </text>
    </svg>
  );
};
