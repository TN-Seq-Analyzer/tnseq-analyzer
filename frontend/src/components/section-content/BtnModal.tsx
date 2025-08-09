import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { toast } from "sonner";
function BtnModal() {
  const { t } = useTranslation("translation", {
    keyPrefix: "content.home.modal",
  });
  const [nameProject, setNameProject] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => {
    setOpen(false);
    setNameProject("");
  };
  const handleSubmit = () => {
    if (nameProject.trim().length >= 2) {
      setOpen(false);
      toast.success(`${t("toastSuccess")}`);
      navigate("/processSample");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            size="default"
            className="bg-primary text-textPrimary font-inter h-[30px] w-[90px] cursor-pointer rounded-full text-[10px] font-bold select-none"
          >
            {t("nameButton")}
          </Button>
        </DialogTrigger>
        <DialogContent className="border-0 bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="select-none">{t("title")}</DialogTitle>
            <DialogDescription className="select-none">
              {t("description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">{t("label")}</Label>
              <Input
                id="name-1"
                name="name"
                value={nameProject}
                required
                minLength={2}
                onChange={(e) => setNameProject(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-[30px] w-[80px] cursor-pointer border-gray-300 text-[11px] select-none"
                type="button"
                onClick={() => handleCancel()}
              >
                {t("cancelButton")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-[30px] w-[90px] cursor-pointer text-[11px] select-none"
              disabled={nameProject.trim().length < 2}
              onClick={() => handleSubmit()}
            >
              {t("createButton")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default BtnModal;
