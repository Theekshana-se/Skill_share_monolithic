
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AboutSectionProps {
  bio: string | undefined;
}

const AboutSection = ({ bio }: AboutSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Me</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{bio || "No bio information available."}</p>
      </CardContent>
    </Card>
  );
};

export default AboutSection;
