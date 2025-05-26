import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import DatePicker from "../form/date-picker";
import TextArea from "../form/input/TextArea";

type ModalProps = {
  action?: "create" | "update" | "delete" | "approval" | null;
  isOpen: boolean;
  closeModal: () => void;
};

const ModalFormReport: React.FC<ModalProps> = (props) => {
  const { action, closeModal, isOpen } = props;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <h4 className=" mb-7 text-lg font-medium text-gray-800 dark:text-white/90">
          {action === "create"
            ? "Buat "
            : action === "update"
            ? "Edit "
            : action === "delete"
            ? "Hapus "
            : "Persetujan "}
          Laporan Publikasi
        </h4>
        {(action === "create" || action === "update") && (
          <form className="">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <div className="col-span-1">
                <Label>Jenis Laporan</Label>
                <Input type="text" placeholder="Jenis lLaporan" />
              </div>

              <div className="col-span-1">
                <Label>Judul Laporan</Label>
                <Input type="text" placeholder="Judul laporan" />
              </div>

              <div className="col-span-1 sm:col-span-2">
                <Label>Deskripsi Laporan</Label>
                <TextArea placeholder="Deskrpsi laporan" rows={3} />
              </div>

              <div className="col-span-1">
                <DatePicker
                  id="date-picker"
                  label="Awal Periode Laporan"
                  placeholder="Pilih tanggal"
                  onChange={(dates, currentDateString) => {
                    // Handle your logic
                    console.log({ dates, currentDateString });
                  }}
                />
              </div>

              <div className="col-span-1">
                <DatePicker
                  id="date-picker"
                  label="Akhir Periode Laporan"
                  placeholder="Pilih tanggal"
                  onChange={(dates, currentDateString) => {
                    // Handle your logic
                    console.log({ dates, currentDateString });
                  }}
                />
              </div>

              <div className="col-span-1">
                <Label>Tahun Laporan</Label>
                <Input type="number" placeholder="Tahun laporan" />
              </div>

              <div className="col-span-1">
                <Label>Kuartal</Label>
                <Input type="number" placeholder="Kuartal" />
              </div>

              <div className="col-span-1">
                <Label>URL/File Path Dokumenen</Label>
                <Input type="text" placeholder="File path" />
              </div>

              <div className="col-span-1">
                <Label>Version</Label>
                <Input type="text" placeholder="contoh: v1.0, final" />
              </div>
            </div>

            <div className="flex items-center justify-end w-full gap-3 mt-8">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm">Save Changes</Button>
            </div>
          </form>
        )}
        {action === "delete" && <p>Delete ?</p>}
        {action === "approval" && <p>Approve?</p>}
      </Modal>
    </>
  );
};

export default ModalFormReport;
