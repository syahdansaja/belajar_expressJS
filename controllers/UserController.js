class UserController {
  async index(req, res) {
    res.json({
      nama: "Muhammad Syahdan Farisqi",
      kelas: "XII RPL 4",
    });
  }
  async create(req, res) {
    res.json({
        
    })
  }
}
export default new UserController();
