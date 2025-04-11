
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

const CommunityActivity = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-1 text-gray-800">Community Activity</h2>
        <p className="text-gray-500 text-sm">See what others are building in real-time</p>
      </div>

      <Card className="shadow-sm bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-full max-w-sm mx-auto">
              <div className="text-gray-500 mb-6">
                Nobody's building right now... Even Batman had Robin to keep him company 🦸‍♂️
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-600"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Invite friends
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityActivity;
