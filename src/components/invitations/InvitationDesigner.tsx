import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InvitationTemplates, { InvitationTemplate } from "./InvitationTemplates";
import InvitationEditor from "./InvitationEditor";
import { Palette } from "lucide-react";

type InvitationDesignerProps = {
  registryTitle: string;
  registryDate?: string;
  onSaveDesign: (designData: any) => void;
};

export default function InvitationDesigner({
  registryTitle,
  registryDate,
  onSaveDesign,
}: InvitationDesignerProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<InvitationTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("templates");
  const [savedDesign, setSavedDesign] = useState<any | null>(null);

  const handleSelectTemplate = (template: InvitationTemplate) => {
    setSelectedTemplate(template);
    setActiveTab("editor");
  };

  const handleSaveDesign = (designData: any) => {
    setSavedDesign(designData);
    onSaveDesign(designData);
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Palette className="mr-2 h-4 w-4" />
            {savedDesign
              ? "Edit Invitation Design"
              : "Create Invitation Design"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {savedDesign
                ? "Edit Invitation Design"
                : "Create Invitation Design"}
            </DialogTitle>
            <DialogDescription>
              Design a beautiful invitation to send along with your registry
              link
            </DialogDescription>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-4 flex-1 overflow-hidden flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Choose Template</TabsTrigger>
              <TabsTrigger value="editor" disabled={!selectedTemplate}>
                Customize Design
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="templates"
              className="py-4 flex-1 overflow-hidden"
            >
              <div className="h-[60vh] overflow-auto">
                <InvitationTemplates
                  onSelectTemplate={handleSelectTemplate}
                  selectedTemplateId={selectedTemplate?.id}
                />
              </div>
            </TabsContent>

            <TabsContent value="editor" className="py-4 flex-1 overflow-auto">
              {selectedTemplate && (
                <InvitationEditor
                  template={selectedTemplate}
                  registryTitle={registryTitle}
                  registryDate={registryDate}
                  onSave={handleSaveDesign}
                />
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            {activeTab === "templates" ? (
              <Button
                onClick={() => setActiveTab("editor")}
                disabled={!selectedTemplate}
              >
                Next: Customize Design
              </Button>
            ) : (
              <Button onClick={() => setActiveTab("templates")}>
                Back to Templates
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {savedDesign && (
        <div className="mt-4 border rounded-lg p-4">
          <h3 className="font-medium mb-2">Invitation Design Preview</h3>
          <div className="aspect-[3/4] w-full max-w-[200px] mx-auto relative rounded-lg overflow-hidden border shadow-sm">
            <div
              className="w-full h-full p-4 flex flex-col items-center justify-center text-center"
              style={{
                backgroundImage: `url(${savedDesign.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: savedDesign.colors.text,
                fontFamily: savedDesign.font,
              }}
            >
              {/* Semi-transparent overlay */}
              <div
                className="absolute inset-0 opacity-70"
                style={{ backgroundColor: savedDesign.colors.primary }}
              />

              {/* Content */}
              <div className="relative z-10">
                <div
                  className="text-sm font-bold mb-1"
                  style={{ color: savedDesign.colors.accent }}
                >
                  {savedDesign.title}
                </div>

                <div
                  className="text-xs mb-2"
                  style={{ color: savedDesign.colors.secondary }}
                >
                  {savedDesign.subtitle}
                </div>

                <div className="text-[8px] mb-2">
                  {savedDesign.message.substring(0, 50)}...
                </div>

                <div
                  className="text-[8px] mt-2 p-1 rounded-sm"
                  style={{ backgroundColor: `${savedDesign.colors.accent}50` }}
                >
                  View Registry
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
