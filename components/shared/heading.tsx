import { FC } from 'react';

interface HeadingProps {
  text: string;
}

export const Heading: FC<HeadingProps> = ({ text }) => {
  return <h1 className="mb-24 mt-1 text-3xl font-bold">{text}</h1>;
};
